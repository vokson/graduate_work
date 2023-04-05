import logging
import math
import operator
import random
from abc import ABC, abstractmethod
from uuid import uuid4

from src.domain.models import CdnServer


logger = logging.getLogger(__name__)


class CdnServerRepository:
    __tablename__ = "servers"

    ADD_QUERY = f"""
                    INSERT INTO {__tablename__}
                        (
                            id, 
                            name,
                            host,
                            port,
                            location,
                            latitude,
                            longitude
                        )
                    VALUES
                        ($1, $2, $3, $4, $5, $6, $7);
                    """

    # UPDATE_QUERY = f"""
    #                 UPDATE {__users_tablename__} SET
    #                     (
    #                         id,
    #                         username,
    #                         password,
    #                         email,
    #                         first_name,
    #                         last_name,
    #                         is_superuser,
    #                         access_token,
    #                         refresh_token,
    #                         access_token_expire_at,
    #                         refresh_token_expire_at,
    #                         created,
    #                         updated
    #                     ) = (
    #                         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    #                     )
    #                 WHERE id = $1;
    #                 """

    # GET_BY_ID_QUERY = f"SELECT * FROM {__users_tablename__} WHERE id = $1;"
    GET_ALL_QUERY = f"SELECT * FROM {__tablename__};"

    GET_BY_NAME_QUERY = f"SELECT * FROM {__tablename__} WHERE name = $1;"

    # ADD_PERMISSIONS_QUERY = f"""
    #                 INSERT INTO {__permissions_tablename__} (id, name)
    #                 VALUES ($1, $2)
    #                 ON CONFLICT DO NOTHING;
    #                 """

    # GET_PERMISSIONS_OF_USER_QUERY = f"""
    #                 SELECT p.name FROM {__user_permission_tablename__} up
    #                 JOIN {__permissions_tablename__} p ON up.permission_id  = p.id
    #                 WHERE up.user_id = $1;
    #                 """

    # DELETE_ALL_PERMISSIONS_FROM_USER = f"""
    #                 DELETE FROM {__user_permission_tablename__} WHERE user_id = $1;
    #                 """

    # SET_PERMISSIONS_TO_USER = f"""
    #                 INSERT INTO {__user_permission_tablename__} (
    #                     id, user_id, permission_id
    #                 ) (
    #                     SELECT
    #                         uuid_generate_v4(), $1, id
    #                     FROM {__permissions_tablename__}
    #                     WHERE name = ANY($2)
    #                 );
    #                 """

    def __init__(self, conn):
        self._conn = conn

    def _convert_row_to_obj(self, row) -> CdnServer:
        return CdnServer(**{k: v for k, v in row.items()})

    async def add(self, obj: CdnServer):
        logger.debug(f"Add cdn server: {obj.dict()}")
        await self._conn.execute(
            self.ADD_QUERY,
            obj.id,
            obj.name,
            obj.host,
            obj.port,
            obj.location,
            obj.latitude,
            obj.longitude,
        )

    # async def get_by_id(self, id) -> CdnServer:
    #     logger.debug(f"Get user with id {id}")
    #     row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
    #     if not row:
    #         return

    #     perms = await self._conn.fetch(self.GET_PERMISSIONS_OF_USER_QUERY, id)

    #     return User(
    #         **{
    #             **{k: v for k, v in row.items()},
    #             **{"permissions": [x["name"] for x in perms]},
    #         }
    #     )

    async def get_by_name(self, name) -> CdnServer:
        logger.debug(f"Get cdn server with name {name}")
        row = await self._conn.fetchrow(self.GET_BY_NAME_QUERY, name)

        if not row:
            return

        return self._convert_row_to_obj(row)

    async def get_all(self) -> list[CdnServer]:
        logger.debug(f"Get all cdn servers")
        rows = await self._conn.fetch(self.GET_ALL_QUERY)
        return [self._convert_row_to_obj(row) for row in rows]

    def _calculate_distance(
        self, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        R = 6371  #  Radius of the Earth in km
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        a = math.sin(dLat / 2) * math.sin(dLat / 2) + math.cos(
            math.radians(lat1)
        ) * math.cos(math.radians(lat2)) * math.sin(dLon / 2) * math.sin(
            dLon / 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c  # Distance in km

    async def get_nearest(
        self, coordinates: tuple[float, float] | None
    ) -> CdnServer:
        servers = await self.get_all()

        if not coordinates:
            logger.debug(f"Get random cdn server")
            return random.choice(servers)

        logger.debug(f"Get nearest cdn server")
        lat, lon = coordinates
        distances = [
            self._calculate_distance(lat, lon, x.latitude, x.longitude)
            for x in servers
        ]
        min_index, min_value = min(
            enumerate(distances), key=operator.itemgetter(1)
        )
        return servers[min_index]

    # async def update(self, obj: User):
    #     logger.debug(f"Update user: {obj.dict()}")
    #     await self._conn.execute(
    #         self.UPDATE_QUERY,
    #         obj.id,
    #         obj.username,
    #         obj.password,
    #         obj.email,
    #         obj.first_name,
    #         obj.last_name,
    #         obj.is_superuser,
    #         obj.access_token,
    #         obj.refresh_token,
    #         obj.access_token_expire_at,
    #         obj.refresh_token_expire_at,
    #         obj.created,
    #         obj.updated,
    #     )

    #     await self._conn.execute(self.DELETE_ALL_PERMISSIONS_FROM_USER, obj.id)
    #     if obj.permissions:
    #         await self._conn.executemany(
    #             self.ADD_PERMISSIONS_QUERY,
    #             [(uuid4(), x) for x in obj.permissions],
    #         )
    #         await self._conn.execute(
    #             self.SET_PERMISSIONS_TO_USER, obj.id, obj.permissions
    #         )
