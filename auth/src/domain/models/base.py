import datetime
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


class CreatedModifiedMixin(BaseModel):
    created: datetime.datetime
    modified: datetime.datetime


class AbstractIdCreatedMofidifiedModel(
    AbstractModel, IdMixin, CreatedModifiedMixin
):
    pass
