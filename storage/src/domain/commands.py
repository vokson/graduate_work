from datetime import datetime
from uuid import UUID

from src.domain.messages import Message
from src.domain.models import BrokerMessage


class Command(Message):
    pass


class GetManyCdnServers(Command):
    pass


class CreateCdnServer(Command):
    user_id: UUID
    name: str
    host: str
    port: int
    location: str
    zone: str
    latitude: float
    longitude: float
    is_on: bool
    is_active: bool


class UpdateCdnServer(CreateCdnServer):
    id: UUID


class DeleteCdnServer(Command):
    user_id: UUID
    id: UUID


class EnrichCdnServerByFiles(Command):
    id: UUID


class RenameFile(Command):
    id: UUID
    user_id: UUID
    name: str


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


class GetDownloadLink(Command):
    file_id: UUID
    ip: str


class GetUserActions(Command):
    user_id: UUID
    limit: int
    offset: int


class CreateFileShareLink(Command):
    user_id: UUID
    file_id: UUID
    password: str | None
    expire_at: datetime | None


class GetFileShareLinks(Command):
    user_id: UUID
    file_id: UUID


class GetFileShareLink(Command):
    file_id: UUID
    link_id: UUID


class DeleteFileShareLink(Command):
    user_id: UUID
    file_id: UUID
    link_id: UUID


class ValidateFileShareLink(Command):
    file_id: UUID
    link_id: UUID
    password: str | None


class HandleBrokerMessage(Command):
    routing_key: str
    body: dict


class HandleS3Event(HandleBrokerMessage):
    pass


class HandleServiceEvent(HandleBrokerMessage):
    pass


class PublishMessage(Command):
    message: BrokerMessage


class FileOperation(Command):
    file_id: UUID
    server_id: UUID


class MarkFileAsStored(FileOperation):
    pass


class OrderFileToDownload(FileOperation):
    pass


class DownloadFileToTempStorage(FileOperation):
    pass


class OrderFileToCopy(FileOperation):
    pass


class DistributeFileWithinZone(Command):
    file_id: UUID
    zone: str


class CopyFile(FileOperation):
    pass


class RemoveFileFromTempStorage(Command):
    file_id: UUID


class OrderFileToRemove(FileOperation):
    pass


class RemoveFile(FileOperation):
    pass


class MarkFileAsRemoved(FileOperation):
    pass
