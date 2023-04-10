from datetime import datetime
from uuid import UUID, uuid4

import orjson
from pydantic import BaseModel, Field
from src.core.config import settings


def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()


class AbstractModel(BaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = orjson_dumps


class IdMixin(BaseModel):
    id: UUID


class CreatedMixin(BaseModel):
    created: datetime

class UpdatedMixin(BaseModel):
    updated: datetime


class AbstractIdModel(AbstractModel, IdMixin):
    pass


class AbstractIdCreatedUpdatedModel(AbstractIdModel, CreatedMixin, UpdatedMixin):
    pass


class CdnServer(AbstractIdModel):
    name: str
    host: str
    port: int
    location: str
    latitude: float
    longitude: float


class File(AbstractIdCreatedUpdatedModel):
    name: str
    size: int
    user_id: UUID

class UserAction(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    obj_id: UUID
    data: dict
    event: str
    created: datetime = Field(default_factory=datetime.now)

class FileActionData(BaseModel):
    name: str

class FileUserAction(UserAction):
    data: FileActionData

class FileUploadedUserAction(FileUserAction):
    event: str = Field('FILE.UPLOADED')

class FileDownloadedUserAction(FileUserAction):
    event: str = Field('FILE.DOWNLOADED')

class FileDeletedUserAction(FileUserAction):
    event: str = Field('FILE.DELETED')

class FileRenamedUserAction(FileUserAction):
    event: str = Field('FILE.RENAMED')


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
