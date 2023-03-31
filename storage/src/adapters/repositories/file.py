import logging
from abc import ABC, abstractmethod
from uuid import uuid4

from src.domain.models import File


logger = logging.getLogger(__name__)


class FileRepository:
    __files_tablename__ = "files"
    __servers_tablename__ = "servers"
    __file_server_tablename__ = "m2m_file_server"

    ADD_QUERY = f"""
                    INSERT INTO {__files_tablename__}
                        (
                            id, 
                            name,
                            size,
                            created,
                            updated
                        )
                    VALUES
                        ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                    """

    UPDATE_QUERY = f"""
                    UPDATE {__files_tablename__} SET
                        (
                            name,
                            size,
                            updated
                        ) = (
                            $1, $2, CURRENT_TIMESTAMP
                        )
                    WHERE id = $1;
                    """

    GET_BY_ID_QUERY = f"SELECT * FROM {__files_tablename__} WHERE id = $1;"

    GET_ALL_QUERY = f"""
                    SELECT
                        f.id,
                        f.name,
                        f.size,
                        f.created,
                        f.updated, s.name as server_name
                    FROM {__file_server_tablename__} fs
                        LEFT JOIN {__files_tablename__} f ON fs.file_id = f.id
                        LEFT JOIN {__servers_tablename__} s ON fs.server_id = s.id
                    """

    # GET_BY_USERNAME_QUERY = (
    #     f"SELECT * FROM {__users_tablename__} WHERE username = $1;"
    # )

    GET_SERVER_NAMES_OF_FILE_QUERY = f"""
                    SELECT s.name FROM {__file_server_tablename__} fs
                    JOIN {__servers_tablename__} s ON fs.server_id  = s.id
                    WHERE fs.file_id = $1;
                    """

    DELETE_ALL_SERVERS_FROM_FILE = f"""
                    DELETE FROM {__file_server_tablename__} WHERE file_id = $1;
                    """

    SET_SERVERS_TO_FILE = f"""
                    INSERT INTO {__file_server_tablename__} (
                        id, file_id, server_id
                    ) (
                        SELECT
                            uuid_generate_v4(), $1, id
                        FROM {__servers_tablename__}
                        WHERE name = ANY($2)
                    );
                    """

    def __init__(self, conn):
        self._conn = conn

    async def add(self, obj: File):
        logger.debug(f"Add file: {obj.dict()}")
        await self._conn.execute(
            self.ADD_QUERY,
            obj.id,
            obj.name,
            obj.size
        )
        if obj.servers:
            await self._conn.execute(
                self.SET_SERVERS_TO_FILE, obj.id, obj.servers
            )

    async def get_by_id(self, id) -> File:
        logger.debug(f"Get file with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
        if not row:
            return

        servers = await self._conn.fetch(self.GET_SERVER_NAMES_OF_FILE_QUERY, id)

        return File(
            **{
                **{k: v for k, v in row.items()},
                **{"servers": [x["name"] for x in servers]},
            }
        )

    # async def get_by_username(self, username) -> User:
    #     logger.debug(f"Get user with username {username}")
    #     row = await self._conn.fetchrow(self.GET_BY_USERNAME_QUERY, username)
    #     if not row:
    #         return

    #     perms = await self._conn.fetch(
    #         self.GET_PERMISSIONS_OF_USER_QUERY, row["id"]
    #     )

    #     return User(
    #         **{
    #             **{k: v for k, v in row.items()},
    #             **{"permissions": [x["name"] for x in perms]},
    #         }
    #     )

    async def get_all(self) -> list[File]:
        logger.debug(f"Get all files")
        rows = await self._conn.fetch(self.GET_ALL_QUERY)
        objs = {}
        for row in rows:
            id = row["id"]
            if id not in objs:
                objs[id] = {
                    "id": id,
                    "name": row["name"],
                    "size": row["size"],
                    "created": row["created"],
                    "updated": row["updated"],
                    "servers": []
                }
            objs[id]["servers"].append(row['server_name'])

        # print(objs[0])
        # print(File(objs[0]))

        return [File(**obj) for obj in objs.values()]

    async def update(self, obj: File):
        logger.debug(f"Update file: {obj.dict()}")
        await self._conn.execute(
            self.UPDATE_QUERY,
            obj.name,
            obj.size,
        )

        await self._conn.execute(self.DELETE_ALL_SERVERS_FROM_FILE, obj.id)
        if obj.servers:
            await self._conn.execute(
                self.SET_SERVERS_TO_FILE, obj.id, obj.servers
            )
