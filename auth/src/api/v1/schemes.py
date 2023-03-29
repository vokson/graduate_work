from datetime import datetime
from typing import Optional, Union
from uuid import UUID

from pydantic import BaseModel


class EmptyResponse(BaseModel):
    pass


class ErrorResponse(BaseModel):
    error: str
    detail: str | None


class RegisterUserRequest(BaseModel):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str


class RegisterUserResponse(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    is_superuser: bool


class LoginByCredentialsRequest(BaseModel):
    username: str
    password: str


class LoginByCredentialsResponse(BaseModel):
    access_token: str
    refresh_token: str


class RefreshTokensResponse(LoginByCredentialsResponse):
    pass


class VerifyTokenRequest(BaseModel):
    permissions: list[str]
