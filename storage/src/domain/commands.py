from uuid import UUID

from pydantic import BaseModel, Field


class Command(BaseModel):
    pass


class CreateCdnServer(Command):
    name: str
    host: str
    port: int
    location: str
    latitude: float
    longitude: float


class GetManyCdnServers(Command):
    pass


# class CreateFile(Command):
#     name: str
#     size: str
#     user_id: UUID
#     servers: list[str]


class DeleteFile(Command):
    id: UUID
    user_id: UUID


class GetManyFiles(Command):
    user_id: UUID


class GetFileServers(Command):
    id: UUID


class GetUploadLink(Command):
    name: str
    size: int
    user_id: UUID
    ip: str


class HandleS3Event(Command):
    routing_key: str
    body: dict

class MarkFileAsStored(Command):
    file_id: UUID
    server_id: UUID

class OrderFileToCopy(Command):
    file_id: UUID
    from_server_id: UUID
    to_server_id: UUID


# class CollectStorageEvents(Command):
#     pass
