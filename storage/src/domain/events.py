from pydantic import BaseModel
from uuid import UUID


class Event(BaseModel):
    pass


class FileStored(Event):
    id: UUID
    storage_name: str


class FileRemovedFromStorage(Event):
    id: UUID
    storage_name: str
