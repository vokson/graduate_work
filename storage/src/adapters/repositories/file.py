import logging
from uuid import UUID

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

    GET_ALL_QUERY = f"SELECT * FROM {__files_tablename__} WHERE user_id = $1;"

    DELETE_QUERY = f"DELETE FROM {__files_tablename__} WHERE id = $1;"

    GET_IDS_OF_SERVERS = f"SELECT server_id FROM {__file_server_tablename__} WHERE file_id = $1;"

    ADD_SERVER_TO_FILE = f"""
                            INSERT INTO {__file_server_tablename__} (id, file_id, server_id)
                            (SELECT uuid_generate_v4(), $1, $2) ON CONFLICT DO NOTHING;
                        """
    REMOVE_SERVER_FROM_FILE = f"DELETE FROM {__file_server_tablename__} WHERE file_id = $1 AND server_id = $2;"

    REMOVE_ALL_SERVERS_FROM_FILE = (
        f"DELETE FROM {__file_server_tablename__} WHERE file_id = $1;"
    )

    IS_FILE_ON_ALL_SERVERS = f""" SELECT (
                                    SELECT COUNT(server_id)
                                    FROM {__file_server_tablename__}
                                    WHERE file_id = $1 
                                ) = (
                                    SELECT COUNT(id) from {__servers_tablename__} 
                                ) as result;
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

    async def get_by_id(self, id: UUID) -> File:
        logger.debug(f"Get file with id {id}")
        row = await self._conn.fetchrow(self.GET_BY_ID_QUERY, id)
        if not row:
            return

        return self._convert_row_to_obj(row)

    async def get_by_name_and_user_id(self, name: str, user_id: UUID) -> UUID:
        logger.debug(f"Get file with name {name} and user_id {user_id}")
        row = await self._conn.fetchrow(
            self.GET_BY_NAME_AND_USER_ID_QUERY, name, user_id
        )

        if not row:
            return

        return self._convert_row_to_obj(row)

    async def get_non_deleted(self, user_id: UUID) -> list[File]:
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

    async def get_ids_of_servers(self, file_id: UUID):
        logger.debug(f"Get IDs servers of file with ID {id}")
        rows = await self._conn.fetch(self.GET_IDS_OF_SERVERS, file_id)
        return [row["server_id"] for row in rows]

    async def add_server_to_file(self, file_id: UUID, server_id: UUID):
        logger.debug(f"Add server {server_id} to file {file_id}")
        await self._conn.execute(self.ADD_SERVER_TO_FILE, file_id, server_id)

    async def remove_server_from_file(self, file_id: UUID, server_id: UUID):
        logger.debug(f"Remove server {server_id} from file {file_id}")
        await self._conn.execute(
            self.REMOVE_SERVER_FROM_FILE, file_id, server_id
        )

    async def remove_all_servers_from_file(self, file_id: UUID):
        logger.debug(f"Remove all servers from file {file_id}")
        await self._conn.execute(self.REMOVE_ALL_SERVERS_FROM_FILE, file_id)

    async def is_copied(self, file_id: UUID):
        logger.debug(f"Check if file {file_id} located on all servers")
        row = await self._conn.fetchrow(self.IS_FILE_ON_ALL_SERVERS, file_id)
        return bool(row["result"])
