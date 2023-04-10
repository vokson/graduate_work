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

    GET_QUERY = f"""
                    SELECT * FROM {__tablename__} WHERE
                    file_id = $1 ORDER BY created DESC;
                """

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

    async def get(self, file_id: UUID) -> FileShareLink:
        logger.debug(f"Get share links of file {file_id}")

        rows = await self._conn.fetch(self.GET_QUERY, file_id)
        return [self._convert_row_to_obj(row) for row in rows]
