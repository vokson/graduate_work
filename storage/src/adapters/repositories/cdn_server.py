import logging
import math
import operator
import random
from abc import ABC, abstractmethod
from uuid import UUID, uuid4

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
                            zone,
                            latitude,
                            longitude,
                            is_on,
                            is_ready,
                            created,
                            updated
                        )
                    VALUES
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
                    """

    GET_ALL_QUERY = f"SELECT * FROM {__tablename__};"
    GET_BY_ID_QUERY = f"SELECT * FROM {__tablename__} WHERE id = $1;"
    GET_BY_NAME_QUERY = f"SELECT * FROM {__tablename__} WHERE name = $1;"

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
            obj.zone,
            obj.latitude,
            obj.longitude,
            obj.is_on,
            obj.is_ready,
            obj.created,
            obj.updated
        )

    async def get_by_id(self, id: UUID) -> CdnServer:
        logger.debug(f"Get cdn server with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)

        if not row:
            return

        return self._convert_row_to_obj(row)

    async def get_by_name(self, name: str) -> CdnServer:
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
        self,
        coordinates: tuple[float, float] | None,
        only_servers: list[UUID] | None = None,
    ) -> CdnServer:
        servers = await self.get_all()
        filtered_servers = (
            [x for x in servers if x.id in only_servers]
            if only_servers
            else servers
        )

        if not coordinates:
            logger.debug(f"Get random cdn server")
            return random.choice(filtered_servers)

        logger.debug(f"Get nearest cdn server")
        lat, lon = coordinates
        distances = [
            self._calculate_distance(lat, lon, x.latitude, x.longitude)
            for x in filtered_servers
        ]
        min_index, min_value = min(
            enumerate(distances), key=operator.itemgetter(1)
        )
        return filtered_servers[min_index]

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
