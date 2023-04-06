from datetime import datetime
from uuid import UUID

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


class CreatedUpdatedMixin(BaseModel):
    created: datetime
    updated: datetime


class AbstractIdModel(AbstractModel, IdMixin):
    pass


class AbstractIdCreatedUpdatedModel(AbstractIdModel, CreatedUpdatedMixin):
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
    has_deleted: bool = Field(False)
    has_executed: bool = Field(False)

class BrokerMessage(BaseModel):
    message: dict
    app: str = Field(settings.app_name)

class FileStoredBrokerMessage(BrokerMessage):
    key: str = Field('FILE.STORED')


