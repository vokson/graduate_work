import logging
import math
import operator
import random
from uuid import UUID

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
                            is_active,
                            created,
                            updated
                        )
                    VALUES
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
                    """

    UPDATE_QUERY = f"""
                    UPDATE {__tablename__} SET
                        (
                            name,
                            host,
                            port,
                            location,
                            zone,
                            latitude,
                            longitude,
                            is_on,
                            is_active,
                            created,
                            updated
                        ) = (
                            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
                        )
                    WHERE id = $1;
                    """

    DELETE_QUERY = f"DELETE FROM {__tablename__} WHERE id = $1;"

    GET_ALL_QUERY = f"SELECT * FROM {__tablename__};"

    GET_SWITCHED_ON_WITHIN_ZONE_QUERY = f"""
                            SELECT * FROM {__tablename__} WHERE zone = $1
                            AND is_on = true AND is_active = $2;
                        """

    GET_SWITCHED_ON_QUERY = f"""
                            SELECT * FROM {__tablename__} WHERE
                            is_on = true AND is_active = $1;
                        """

    GET_BY_ID_QUERY = f"SELECT * FROM {__tablename__} WHERE id = $1;"
    GET_BY_NAME_QUERY = f"SELECT * FROM {__tablename__} WHERE name = $1;"

    def __init__(self, conn):
        self._conn = conn

    def _convert_row_to_obj(self, row) -> CdnServer:
        return CdnServer(**dict(row.items()))

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
            obj.is_active,
            obj.created,
            obj.updated,
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
        logger.debug("Get all cdn servers")
        rows = await self._conn.fetch(self.GET_ALL_QUERY)
        return [self._convert_row_to_obj(row) for row in rows]

    async def get_switched_on(
        self,
        is_active: bool = True,
        zone: str | None = None,
    ) -> list[CdnServer]:
        logger.info(
            f"Get switched on cdn servers in zone {zone}, "
            f"is_active {is_active}",
        )

        query = (
            self.GET_SWITCHED_ON_QUERY
            if zone is None
            else self.GET_SWITCHED_ON_WITHIN_ZONE_QUERY
        )
        params = (
            (is_active,)
            if zone is None
            else (
                zone,
                is_active,
            )
        )

        rows = await self._conn.fetch(query, *params)
        return [self._convert_row_to_obj(row) for row in rows]

    def _calculate_distance(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
        R = 6371  # noqa Radius of the Earth in km
        dLat = math.radians(lat2 - lat1)  # noqa
        dLon = math.radians(lon2 - lon1)  # noqa
        a = math.sin(dLat / 2) * math.sin(dLat / 2) + math.cos(
            math.radians(lat1),
        ) * math.cos(math.radians(lat2)) * math.sin(dLon / 2) * math.sin(
            dLon / 2,
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c  # Distance in km

    async def get_nearest(
        self,
        coordinates: tuple[float, float] | None,
        only_servers: list[UUID] | None = None,
    ) -> CdnServer:
        servers = await self.get_switched_on()
        filtered_servers = (
            [x for x in servers if x.id in only_servers]
            if only_servers
            else servers
        )

        if not coordinates:
            logger.debug("Get random cdn server")
            return random.choice(filtered_servers)

        logger.debug("Get nearest cdn server")
        lat, lon = coordinates
        distances = [
            self._calculate_distance(lat, lon, x.latitude, x.longitude)
            for x in filtered_servers
        ]
        min_index, min_value = min(
            enumerate(distances),
            key=operator.itemgetter(1),
        )
        return filtered_servers[min_index]

    async def update(self, obj: CdnServer):
        logger.debug(f"Updated cdn server: {obj.dict()}")
        await self._conn.execute(
            self.UPDATE_QUERY,
            obj.id,
            obj.name,
            obj.host,
            obj.port,
            obj.location,
            obj.zone,
            obj.latitude,
            obj.longitude,
            obj.is_on,
            obj.is_active,
            obj.created,
            obj.updated,
        )

    async def delete(self, id: UUID):
        logger.debug(f"Delete cdn server with id {id}")
        await self._conn.execute(self.DELETE_QUERY, id)
