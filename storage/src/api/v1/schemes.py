from datetime import datetime
from typing import Optional, Union
from uuid import UUID

from pydantic import BaseModel


class EmptyResponse(BaseModel):
    pass


class ErrorResponse(BaseModel):
    error: str
    detail: str | None


class CdnServerResponse(BaseModel):
    id: UUID
    name: str
    location: str
    latitude: float
    longitude: float


class FileResponse(BaseModel):
    id: UUID
    name: str
    size: int
    # servers: list[str]
    created: datetime
    updated: datetime


class UploadLinkRequest(BaseModel):
    name: str
    size: int


class LinkResponse(BaseModel):
    file: FileResponse
    link: str


# class RegisterUserRequest(BaseModel):
#     username: str
#     password: str
#     email: str
#     first_name: str
#     last_name: str


# class UserResponse(BaseModel):
#     username: str
#     email: str
#     first_name: str
#     last_name: str
#     is_superuser: bool
#     permissions: list[str]


# class LoginByCredentialsRequest(BaseModel):
#     username: str
#     password: str


# class LoginByCredentialsResponse(BaseModel):
#     access_token: str
#     refresh_token: str


# class RefreshTokensResponse(LoginByCredentialsResponse):
#     pass


# class VerifyTokenRequest(BaseModel):
#     permissions: list[str]
