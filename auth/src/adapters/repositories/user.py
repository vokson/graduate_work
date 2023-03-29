import logging
from abc import ABC, abstractmethod

from src.domain.models import User


logger = logging.getLogger(__name__)


class UserRepository:
    __tablename__ = "users"

    ADD_QUERY = f"""
                    INSERT INTO {__tablename__}
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

    UPDATE_QUERY = f"""
                    UPDATE {__tablename__} SET
                        (
                            id, 
                            username,
                            password,
                            email,
                            first_name,
                            last_name,
                            is_superuser,
                            access_token,
                            refresh_token,
                            access_token_expire_at,
                            refresh_token_expire_at,
                            created,
                            updated
                        ) = (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
                        )
                    WHERE id = $1;
                    """

    GET_BY_ID_QUERY = f"SELECT * FROM {__tablename__} WHERE id = $1;"

    GET_BY_USERNAME_QUERY = (
        f"SELECT * FROM {__tablename__} WHERE username = $1;"
    )

    def __init__(self, conn):
        self._conn = conn

    async def add(self, obj: User):
        logger.debug(f"Add user: {obj.dict()}")
        return await self._conn.execute(
            self.ADD_QUERY,
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

    async def get_by_id(self, id) -> User:
        logger.debug(f"Get user with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
        if not row:
            return

        return User(**{k: v for k, v in row.items()})

    async def get_by_username(self, username) -> User:
        logger.debug(f"Get user with username {username}")
        row = await self._conn.fetchrow(self.GET_BY_USERNAME_QUERY, username)
        if not row:
            return

        return User(**{k: v for k, v in row.items()})

    async def update(self, obj: User):
        logger.debug(f"Update user: {obj.dict()}")
        return await self._conn.execute(
            self.UPDATE_QUERY,
            obj.id,
            obj.username,
            obj.password,
            obj.email,
            obj.first_name,
            obj.last_name,
            obj.is_superuser,
            obj.access_token,
            obj.refresh_token,
            obj.access_token_expire_at,
            obj.refresh_token_expire_at,
            obj.created,
            obj.updated,
        )
