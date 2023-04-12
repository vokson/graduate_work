import logging
from uuid import uuid4

from src.domain.models import User

logger = logging.getLogger(__name__)


class UserRepository:
    __users_tablename__ = "users"
    __permissions_tablename__ = "permissions"
    __user_permission_tablename__ = "user_permissions"

    ADD_QUERY = f"""
                    INSERT INTO {__users_tablename__}
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
                    UPDATE {__users_tablename__} SET
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
                            $1, $2, $3, $4, $5, $6, $7, $8,
                            $9, $10, $11, $12, $13
                        )
                    WHERE id = $1;
                    """

    GET_BY_ID_QUERY = f"SELECT * FROM {__users_tablename__} WHERE id = $1;"

    GET_BY_USERNAME_QUERY = f"""
                    SELECT * FROM {__users_tablename__} WHERE username = $1;
                    """

    ADD_PERMISSIONS_QUERY = f"""
                    INSERT INTO {__permissions_tablename__} (id, name)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING;
                    """

    GET_PERMISSIONS_OF_USER_QUERY = f"""
                    SELECT p.name FROM {__user_permission_tablename__} up
                    JOIN {__permissions_tablename__} p
                    ON up.permission_id  = p.id
                    WHERE up.user_id = $1;
                    """

    DELETE_ALL_PERMISSIONS_FROM_USER = f"""
                    DELETE FROM {__user_permission_tablename__}
                    WHERE user_id = $1;
                    """

    SET_PERMISSIONS_TO_USER = f"""
                    INSERT INTO {__user_permission_tablename__} (
                        id, user_id, permission_id
                    ) (
                        SELECT
                            uuid_generate_v4(), $1, id
                        FROM {__permissions_tablename__}
                        WHERE name = ANY($2)
                    );
                    """

    def __init__(self, conn):
        self._conn = conn

    async def add(self, obj: User):
        logger.debug(f"Add user: {obj.dict()}")
        await self._conn.execute(
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
        if obj.permissions:
            await self._conn.executemany(
                self.ADD_PERMISSIONS_QUERY,
                [(uuid4(), x) for x in obj.permissions],
            )
            await self._conn.execute(
                self.SET_PERMISSIONS_TO_USER,
                obj.id,
                obj.permissions,
            )

    async def get_by_id(self, id) -> User:
        logger.debug(f"Get user with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
        if not row:
            return

        perms = await self._conn.fetch(self.GET_PERMISSIONS_OF_USER_QUERY, id)

        return User(
            **{
                **dict(row.items()),
                **{"permissions": [x["name"] for x in perms]},
            },
        )

    async def get_by_username(self, username) -> User:
        logger.debug(f"Get user with username {username}")
        row = await self._conn.fetchrow(self.GET_BY_USERNAME_QUERY, username)
        if not row:
            return

        perms = await self._conn.fetch(
            self.GET_PERMISSIONS_OF_USER_QUERY,
            row["id"],
        )

        return User(
            **{
                **dict(row.items()),
                **{"permissions": [x["name"] for x in perms]},
            },
        )

    async def update(self, obj: User):
        logger.debug(f"Update user: {obj.dict()}")
        await self._conn.execute(
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

        await self._conn.execute(self.DELETE_ALL_PERMISSIONS_FROM_USER, obj.id)
        if obj.permissions:
            await self._conn.executemany(
                self.ADD_PERMISSIONS_QUERY,
                [(uuid4(), x) for x in obj.permissions],
            )
            await self._conn.execute(
                self.SET_PERMISSIONS_TO_USER,
                obj.id,
                obj.permissions,
            )
