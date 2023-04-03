from uuid import UUID

from pydantic import BaseModel, Field


class Command(BaseModel):
    pass


class CreateCdnServer(Command):
    name: str
    location: str
    latitude: float
    longitude: float

class GetManyCdnServers(Command):
    pass


class CreateFile(Command):
    name: str
    size: str
    servers: list[str]

class GetManyFiles(Command):
    pass

class GetUploadLink(Command):
    id: UUID
    name: str
    size: int
