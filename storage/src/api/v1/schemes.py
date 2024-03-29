from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EmptyResponse(BaseModel):
    pass


class ErrorResponse(BaseModel):
    error: str
    detail: str | None


class CdnServerRequest(BaseModel):
    name: str
    host: str
    port: int
    location: str
    zone: str
    latitude: float
    longitude: float
    is_on: bool
    is_active: bool


class CdnServerResponse(CdnServerRequest):
    id: UUID
    created: datetime
    updated: datetime


class UserActionItemResponse(BaseModel):
    id: UUID
    data: dict
    event: str
    created: datetime


class UserActionResponse(BaseModel):
    count: int
    data: list[UserActionItemResponse]


class FileResponse(BaseModel):
    id: UUID
    name: str
    size: int
    created: datetime
    updated: datetime


class RenameFileRequest(BaseModel):
    name: str


class UploadLinkRequest(BaseModel):
    name: str
    size: int


class LinkResponse(BaseModel):
    file: FileResponse
    link: str


class FileShareLinkRequest(BaseModel):
    lifetime: int | None = Field(None, gt=0)
    password: str | None = Field(None)


class FileShareLinkResponse(BaseModel):
    id: UUID
    file: FileResponse
    is_secured: bool
    expire_at: datetime | None
    created: datetime


class DownloadByShareLinkRequest(BaseModel):
    password: str | None = Field(None)
