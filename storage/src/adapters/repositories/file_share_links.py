import logging
import math
import operator
import random
from abc import ABC, abstractmethod
from uuid import UUID, uuid4

from src.domain.models import FileShareLink


logger = logging.getLogger(__name__)


class FileShareLinkRepository:
    __tablename__ = "file_share_links"

    ADD_QUERY = f"""
                    INSERT INTO {__tablename__}
                        (
                            id,
                            file_id,
                            password,
                            expire_at,
                            created
                        )
                    VALUES
                        ($1, $2, $3, $4, $5);
                    """

    GET_MANY_QUERY = f"""
                    SELECT * FROM {__tablename__} WHERE
                    file_id = $1 ORDER BY created DESC;
                """

    GET_QUERY = f"""
                    SELECT * FROM {__tablename__} WHERE
                    file_id = $1 AND id = $2;
                """

    DELETE_QUERY = f"DELETE FROM {__tablename__} WHERE id = $1;"

    def __init__(self, conn):
        self._conn = conn

    def _convert_row_to_obj(self, row) -> FileShareLink:
        return FileShareLink(**{k: v for k, v in row.items()})

    async def add(self, obj: FileShareLink):
        logger.debug(f"Add share link for file: {obj.file_id}")
        await self._conn.execute(
            self.ADD_QUERY,
            obj.id,
            obj.file_id,
            obj.password,
            obj.expire_at,
            obj.created,
        )

    async def get_many(self, file_id: UUID) -> FileShareLink:
        logger.debug(f"Get share links of file {file_id}")

        rows = await self._conn.fetch(self.GET_MANY_QUERY, file_id)
        return [self._convert_row_to_obj(row) for row in rows]

    async def get(self, file_id: UUID, link_id: UUID) -> FileShareLink:
        logger.debug(f"Get share link {link_id} of file {file_id}")

        row = await self._conn.fetchrow(self.GET_QUERY, file_id, link_id)

        if not row:
            return

        return self._convert_row_to_obj(row)

    async def delete(self, link_id: UUID):
        logger.debug(f"Delete link with id {link_id}")
        await self._conn.execute(self.DELETE_QUERY, link_id)
