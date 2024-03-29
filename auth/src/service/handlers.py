from asyncpg.exceptions import (InterfaceError, PostgresError,
                                UniqueViolationError)
from pydantic.error_wrappers import ValidationError as PydanticValidationError

from src.core import exceptions
from src.domain import command_results, commands
from src.service import command_handlers

EVENT_HANDLERS = {}

COMMAND_HANDLERS = {
    commands.CheckRequiredPermissions: command_handlers.check_required_permissions,  # noqa
    commands.CreateUser: command_handlers.create_user,
    commands.GetUserById: command_handlers.get_user_by_id,
    commands.LoginByCredentials: command_handlers.login_by_credentials,
    commands.Logout: command_handlers.logout,
    commands.RefreshTokens: command_handlers.refresh_tokens,
    commands.VerifyToken: command_handlers.verify_token,
}

RESULTS = {
    PostgresError: command_results.DatabaseError,
    InterfaceError: command_results.DatabaseError,
    UniqueViolationError: command_results.UniqueViolationDatabaseError,
    PydanticValidationError: command_results.ValidationError,
    exceptions.AuthTokenMissedException: command_results.AuthTokenMissedException,  # noqa
    exceptions.AuthTokenWithWrongSignatureException: command_results.AuthTokenWithWrongSignatureException,  # noqa
    exceptions.AuthTokenOutdatedException: command_results.AuthTokenOutdatedException,  # noqa
    exceptions.AuthTokenWrongPayloadException: command_results.AuthTokenWrongPayloadException,  # noqa
    exceptions.AuthNoPermissionException: command_results.AuthNoPermissionException,  # noqa
    exceptions.UserDoesNotExist: command_results.UserDoesNotExist,
    exceptions.UserAlreadyExists: command_results.UserAlreadyExists,
    exceptions.WrongCredentials: command_results.WrongCredentials,
}
