from uuid import UUID

from src.domain.messages import Message


class Event(Message):
    pass


class CdnServerUpdated(Event):
    id: UUID


class FileStored(Event):
    id: UUID
    storage_name: str


class FileRemovedFromStorage(Event):
    id: UUID
    storage_name: str


class FileDownloadedToTempStorage(Event):
    id: UUID
    zone: str


class FileDistributed(Event):
    id: UUID


class FileDeleted(Event):
    id: UUID
