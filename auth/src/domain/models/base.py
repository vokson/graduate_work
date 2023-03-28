import datetime
from uuid import UUID

import orjson
from pydantic import BaseModel, Field


def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()


class AbstractModel(BaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = orjson_dumps


class IdMixin(BaseModel):
    id: UUID


class CreatedUpdatedMixin(BaseModel):
    created: datetime.datetime
    updated: datetime.datetime = Field(default_factory=datetime.datetime.now)


class AbstractIdCreatedUpdatedModel(
    AbstractModel, IdMixin, CreatedUpdatedMixin
):
    pass
