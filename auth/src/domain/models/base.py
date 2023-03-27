import orjson
from pydantic import BaseModel
from uuid import UUID


def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()


class AbstractModel(BaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = orjson_dumps

class IdMixin(BaseModel):
    id: UUID

class CreatedModifiedMixin(BaseModel):
    created: datetime
    modified: datetime

class AbstractIdCreatedMofidifiedModel(AbstractModel, IdMixin, CreatedModifiedMixin):
    pass

