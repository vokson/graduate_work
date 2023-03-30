from uuid import UUID

from pydantic import BaseModel, Field


class Command(BaseModel):
    pass


class CreateUser(Command):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str
    is_superuser: bool = Field(False)
    permissions: list[str] = Field(default=[])


class GetUserById(Command):
    user_id: UUID


class LoginByCredentials(Command):
    username: str
    password: str

class Logout(Command):
    user_id: UUID


class CheckRequiredPermissions(Command):
    required_permissions: list[str]
    auth_header: str
    is_access_token: bool


class RefreshTokens(Command):
    user_id: UUID


class VerifyToken(Command):
    is_superuser: bool
    required_permissions: list[str]
    existing_permissions: list[str]
