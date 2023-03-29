import logging
import time
from datetime import datetime
from uuid import UUID, uuid4

import jwt
from asyncpg.exceptions import PostgresError
from src.core import exceptions
from src.core.config import settings
from src.domain import command_results, commands, events
from src.domain.models import User
from src.service.uow import AbstractUnitOfWork
from src.tools.hasher import PBKDF2PasswordHasher


logger = logging.getLogger(__name__)


async def check_required_permissions(
    cmd: commands.CheckRequiredPermissions,
    uow: AbstractUnitOfWork,
):
    if not cmd.auth_header:
        raise exceptions.AuthTokenMissedException

    parts = cmd.auth_header.split()

    if len(parts) != 2 or parts[0] != "Bearer":
        raise exceptions.AuthTokenMissedException

    encoded_token = parts[1]

    try:
        payload = jwt.decode(
            encoded_token, settings.token.secret_key, [settings.token.algo]
        )

    except (
        jwt.exceptions.InvalidSignatureError,
        jwt.exceptions.DecodeError,
    ):
        raise exceptions.AuthTokenWithWrongSignatureException

    except jwt.exceptions.ExpiredSignatureError:
        raise exceptions.AuthTokenOutdatedException

    async with uow:
        if await uow.cache.get(encoded_token):
            raise exceptions.AuthTokenOutdatedException

    token_permissions = payload.get("permissions")
    token_type = payload.get("token_type")
    is_superuser = payload.get("is_superuser")

    user_id = payload.get("user_id")
    try:
        user_id = UUID(user_id)
    except Exception:
        raise exceptions.AuthTokenWrongPayloadException

    if (
        token_permissions is None
        or user_id is None
        or is_superuser is None
        or token_type is None
        or (token_type == "access") != cmd.is_access_token  # noqa: S105
    ):
        raise exceptions.AuthTokenWrongPayloadException

    if (
        not is_superuser
        and len(set(cmd.required_permissions) - set(token_permissions)) > 0
    ):
        raise exceptions.AuthNoPermissionException

    result = {
        "user_id": user_id,
        "is_superuser": is_superuser,
        "permissions": token_permissions,
        "token": encoded_token,
    }

    return command_results.PositiveCommandResult(result)
