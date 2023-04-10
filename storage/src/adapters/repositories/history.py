import logging
import math
import operator
import random
from abc import ABC, abstractmethod
from uuid import UUID, uuid4

from src.domain.models import UserAction


logger = logging.getLogger(__name__)


class HistoryRepository:
    __tablename__ = "history"

    ADD_QUERY = f"""
                    INSERT INTO {__tablename__}
                        (
                            id,
                            user_id,
                            obj_id,
                            event,
                            data,
                            created
                        )
                    VALUES
                        ($1, $2, $3, $4, $5, $6);
                    """

    GET_QUERY = f"SELECT * FROM {__tablename__} WHERE user_id = $1 ORDER BY created DESC;"

    def __init__(self, conn):
        self._conn = conn

    def _convert_row_to_obj(self, row) -> UserAction:
        return UserAction(**{k: v for k, v in row.items()})

    async def add(self, obj: UserAction):
        logger.debug(f"Add user action server: {obj.dict()}")
        await self._conn.execute(
            self.ADD_QUERY,
            obj.id,
            obj.user_id,
            obj.obj_id,
            obj.event,
            obj.data,
            obj.created,
        )

    async def get(self, user_id: UUID) -> UserAction:
        logger.debug(f"Get actions of user {user_id}")
        rows = await self._conn.fetch(self.GET_QUERY, user_id)
        return [self._convert_row_to_obj(row) for row in rows]
