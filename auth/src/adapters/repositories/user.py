import logging
from abc import ABC, abstractmethod

from src.domain.models.base import AbstractModel
from src.domain.models.user import User


logger = logging.getLogger(__name__)


# class AbstractRepository(ABC):
#     @abstractmethod
#     async def add(self, obj: AbstractModel):
#         raise NotImplementedError

# @abstractmethod
# async def get_by_username(self, reference) -> AbstractModel:
#     raise NotImplementedError
TABLE_USERS = "users"

ADD_QUERY = f"""
                INSERT INTO {TABLE_USERS}
                    (
                        id, 
                        username,
                        password,
                        email,
                        first_name,
                        last_name,
                        is_superuser,
                        created,
                        updated
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9);
                """

GET_BY_USERNAME_QUERY = f"SELECT * FROM {TABLE_USERS} WHERE username = $1;"


class UserRepository:
    def __init__(self, conn):
        self._conn = conn

    async def add(self, obj: User):
        logger.debug(f"Add user: {obj.dict()}")
        return await self._conn.execute(
            ADD_QUERY,
            obj.id,
            obj.username,
            obj.password,
            obj.email,
            obj.first_name,
            obj.last_name,
            obj.is_superuser,
            obj.created,
            obj.updated,
        )

    async def get_by_username(self, username):
        logger.debug(f"Get user with username {username}")
        return await self._conn.fetchrow(GET_BY_USERNAME_QUERY, username)

    # def list(self):
    #     return self.session.query(model.Batch).all()
