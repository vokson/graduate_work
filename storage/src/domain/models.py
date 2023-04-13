from datetime import datetime
from uuid import UUID, uuid4

import orjson
from pydantic import BaseModel, Field

from src.core.config import settings, tz_now


def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()


class AbstractModel(BaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = orjson_dumps


class IdMixin(BaseModel):
    id: UUID = Field(default_factory=uuid4)


class CreatedMixin(BaseModel):
    created: datetime = Field(default_factory=tz_now)


class UpdatedMixin(BaseModel):
    updated: datetime


class AbstractIdModel(AbstractModel, IdMixin):
    pass


class AbstractIdCreatedUpdatedModel(
    AbstractIdModel,
    CreatedMixin,
    UpdatedMixin,
):
    pass


class CdnServer(AbstractIdCreatedUpdatedModel):
    name: str
    host: str
    port: int
    location: str
    zone: str
    latitude: float
    longitude: float
    is_on: bool
    is_active: bool


class File(AbstractIdCreatedUpdatedModel):
    name: str
    size: int
    user_id: UUID
    has_deleted: bool


class FileShareLink(AbstractIdModel, CreatedMixin):
    file_id: UUID
    password: str | None
    expire_at: datetime | None


class UserAction(AbstractIdModel, CreatedMixin):
    user_id: UUID
    obj_id: UUID
    data: dict
    event: str


class FileActionData(BaseModel):
    name: str


class FileRenameActionData(BaseModel):
    old_name: str
    new_name: str


class FileUserAction(UserAction):
    data: FileActionData


class FileUploadedUserAction(FileUserAction):
    event: str = Field("FILE.UPLOADED")


class FileDownloadedUserAction(FileUserAction):
    event: str = Field("FILE.DOWNLOADED")


class FileDeletedUserAction(FileUserAction):
    event: str = Field("FILE.DELETED")


class FileRenamedUserAction(UserAction):
    data: FileRenameActionData
    event: str = Field("FILE.RENAMED")


class FileShareLinkActionData(BaseModel):
    name: str
    created: datetime


class FileShareLinkUserAction(UserAction):
    data: FileShareLinkActionData


class FileShareLinkCreatedUserAction(FileShareLinkUserAction):
    event: str = Field("FILE_SHARE_LINK.CREATED")


class FileShareLinkDeletedUserAction(FileShareLinkUserAction):
    event: str = Field("FILE_SHARE_LINK.DELETED")


class CdnServerActionData(BaseModel):
    name: str
    location: str
    zone: str


class CdnServerUserAction(UserAction):
    data: CdnServerActionData


class CdnServerCreatedUserAction(CdnServerUserAction):
    event: str = Field("CDN_SERVER.CREATED")


class CdnServerUpdatedUserAction(CdnServerUserAction):
    event: str = Field("CDN_SERVER.UPDATED")


class CdnServerDeletedUserAction(CdnServerUserAction):
    event: str = Field("CDN_SERVER.DELETED")


# BROKER MESSAGES


class BrokerMessage(BaseModel):
    message: dict
    key: str
    app: str = Field(settings.app_name)


class FileStoredBrokerMessage(BrokerMessage):
    key: str = Field("FILE.STORED")


class FileOrderedToDownloadBrokerMessage(BrokerMessage):
    key: str = Field("FILE.ORDERED_TO_DOWNLOAD")


class FileOrderedToCopyBrokerMessage(BrokerMessage):
    key: str = Field("FILE.ORDERED_TO_COPY")


class FileOrderedToRemoveBrokerMessage(BrokerMessage):
    key: str = Field("FILE.ORDERED_TO_REMOVE")
