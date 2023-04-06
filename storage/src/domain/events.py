from pydantic import BaseModel


class Event(BaseModel):
    pass

class FileStored(Event):
    id: str
    storage_name: str

class FileRemovedFromStorage(Event):
    id: str
    storage_name: str