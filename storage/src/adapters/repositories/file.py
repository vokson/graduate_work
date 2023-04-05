import logging
from abc import ABC, abstractmethod
from uuid import UUID, uuid4

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
                            user_id,
                            created,
                            updated
                        )
                    VALUES
                        ($1, $2, $3, $4, $5, $6);
                    """

    UPDATE_QUERY = f"""
                    UPDATE {__files_tablename__} SET
                        (
                            name,
                            size,
                            user_id,
                            created,
                            updated
                        ) = (
                            $2, $3, $4, $5, $6
                        )
                    WHERE id = $1;
                    """

    GET_BY_ID_QUERY = f"SELECT * FROM {__files_tablename__} WHERE id = $1;"

    GET_BY_NAME_AND_USER_ID_QUERY = f"""
                        SELECT * FROM {__files_tablename__}
                        WHERE name = $1 AND user_id = $2;
                        """

    # GET_ALL_QUERY = f"""
    #                 SELECT
    #                     f.id,
    #                     f.name,
    #                     f.size,
    #                     f.user_id,
    #                     f.created,
    #                     f.updated,
    #                     s.name as server_name
    #                 FROM {__file_server_tablename__} fs
    #                     LEFT JOIN {__files_tablename__} f ON fs.file_id = f.id
    #                     LEFT JOIN {__servers_tablename__} s ON fs.server_id = s.id
    #                 WHERE f.user_id = $1;
    #                 """

    GET_ALL_QUERY = f"SELECT * FROM {__files_tablename__} WHERE user_id = $1;"

    DELETE_QUERY = f"DELETE FROM {__files_tablename__} WHERE id = $1;"

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

    def _convert_row_to_obj(self, row) -> File:
        return File(**{k: v for k, v in row.items()})

    async def add(self, obj: File):
        logger.debug(f"Add file: {obj.dict()}")
        await self._conn.execute(
            self.ADD_QUERY,
            obj.id,
            obj.name,
            obj.size,
            obj.user_id,
            obj.created,
            obj.updated,
        )
        # if obj.servers:
        #     await self._conn.execute(
        #         self.SET_SERVERS_TO_FILE, obj.id, obj.servers
        #     )

    async def get_by_id(self, id: UUID) -> File:
        logger.debug(f"Get file with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
        if not row:
            return

        # servers = await self._conn.fetch(self.GET_SERVER_NAMES_OF_FILE_QUERY, id)
        # return File(
        #     **{
        #         **{k: v for k, v in row.items()},
        #         **{"servers": [x["name"] for x in servers]},
        #     }
        # )

        return self._convert_row_to_obj(row)

    async def get_by_name_and_user_id(self, name: str, user_id: UUID) -> UUID:
        logger.debug(f"Get file with name {name} and user_id {user_id}")
        row = await self._conn.fetchrow(
            self.GET_BY_NAME_AND_USER_ID_QUERY, name, user_id
        )

        if not row:
            return

        return self._convert_row_to_obj(row)

        # servers = await self._conn.fetch(self.GET_SERVER_NAMES_OF_FILE_QUERY, row['id'])

        # return File(
        #     **{
        #         **{k: v for k, v in row.items()},
        #         **{"servers": [x["name"] for x in servers]},
        #     }
        # )

    # async def get_all(self, user_id: UUID) -> list[File]:
    #     logger.debug(f"Get all files")
    #     rows = await self._conn.fetch(self.GET_ALL_QUERY, user_id)
    #     print(user_id, rows)
    #     objs = {}
    #     for row in rows:
    #         id = row["id"]
    #         if id not in objs:
    #             objs[id] = {
    #                 "id": id,
    #                 "name": row["name"],
    #                 "size": row["size"],
    #                 "user_id": row["user_id"],
    #                 "created": row["created"],
    #                 "updated": row["updated"],
    #                 "servers": []
    #             }
    #         objs[id]["servers"].append(row['server_name'])

    #     return [File(**obj) for obj in objs.values()]

    async def get_all(self, user_id: UUID) -> list[File]:
        logger.debug(f"Get all files")
        rows = await self._conn.fetch(self.GET_ALL_QUERY, user_id)
        return [self._convert_row_to_obj(row) for row in rows]

    async def update(self, obj: File):
        logger.debug(f"Update file: {obj.dict()}")
        await self._conn.execute(
            self.UPDATE_QUERY,
            obj.id,
            obj.name,
            obj.size,
            obj.user_id,
            obj.created,
            obj.updated,
        )

    async def delete(self, id: UUID):
        logger.debug(f"Delete file with id {id}")
        await self._conn.execute(self.DELETE_QUERY, id)
