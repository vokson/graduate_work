from datetime import datetime
from uuid import UUID

import orjson
from pydantic import BaseModel


def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()


class AbstractModel(BaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = orjson_dumps


class IdMixin(BaseModel):
    id: UUID


class CreatedUpdatedMixin(BaseModel):
    created: datetime | None
    updated: datetime | None


class AbstractIdModel(
    AbstractModel, IdMixin
):
    pass

class AbstractIdCreatedUpdatedModel(
    AbstractIdModel, CreatedUpdatedMixin
):
    pass


class CdnServer(AbstractIdModel):
    name: str
    location: str
    latitude: float
    longitude: float

class File(AbstractIdCreatedUpdatedModel):
    name: str
    size: int
    servers: list[str]
