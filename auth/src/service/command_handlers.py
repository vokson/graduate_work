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
hasher = PBKDF2PasswordHasher()


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


async def create_user(
    cmd: commands.CreateUser,
    uow: AbstractUnitOfWork,
):
    async with uow:
        user = await uow.users.get_by_username(cmd.username)

        if user:
            raise exceptions.UserAlreadyExists

        hashed_password = hasher.encode(cmd.password, hasher.salt())

        user = User(
            id=uuid4(),
            username=cmd.username,
            password=hashed_password,
            email=cmd.email,
            first_name=cmd.first_name,
            last_name=cmd.last_name,
            is_superuser=cmd.is_superuser,
            created=datetime.now(),
            permissions=cmd.permissions,
        )

        await uow.users.add(user)
        await uow.commit()

    return command_results.PositiveCommandResult(
        user.dict(exclude={"password"})
    )


async def get_user_by_id(
    cmd: commands.GetUserById,
    uow: AbstractUnitOfWork,
):
    async with uow:
        user = await uow.users.get_by_id(cmd.user_id)

        if not user:
            raise exceptions.UserDoesNotExist

    return command_results.PositiveCommandResult(
        user.dict(exclude={"password"})
    )


def encode_token(payload: dict) -> str:
    return jwt.encode(
        payload,
        settings.token.secret_key,
        algorithm=settings.token.algo,
    )


def generate_token_pair(
    user_id: UUID,
    is_superuser: bool,
    perms: list[str],
) -> tuple[str, str, int, int]:
    timestamp = round(time.time())
    base_token = {
        "user_id": str(user_id),
        #  Минус секунда для компенсации рассинхрона
        #  времени на разных серверах
        "iat": timestamp - 1,
        "permissions": perms,
        "is_superuser": is_superuser,
    }

    access_token_expire_at = timestamp + settings.token.access_lifetime
    access_token = {
        **base_token,
        **{
            "exp": access_token_expire_at,
            "token_type": "access",
        },
    }

    refresh_token_expire_at = timestamp + settings.token.refresh_lifetime
    refresh_token = {
        **base_token,
        **{
            "exp": refresh_token_expire_at,
            "token_type": "refresh",
        },
    }

    return (
        encode_token(access_token),
        encode_token(refresh_token),
        access_token_expire_at,
        refresh_token_expire_at,
    )


async def dispose_token_pair(
    uow: AbstractUnitOfWork,
    user: User,
):
    if user.access_token:
        await uow.cache.set(
            user.access_token,
            1,
            expire_at=user.access_token_expire_at,
        )
    if user.refresh_token:
        await uow.cache.set(
            user.refresh_token,
            1,
            expire_at=user.refresh_token_expire_at,
        )


async def refresh_tokens_of_user(
    uow: AbstractUnitOfWork,
    user: User,
):
    #  Генерируем новые токены
    (
        access_token,
        refresh_token,
        access_token_expire_at,
        refresh_token_expire_at,
    ) = generate_token_pair(user.id, user.is_superuser, user.permissions)

    #  Сбрасываем старые токены
    await dispose_token_pair(uow, user)

    #  Обновляем данные пользователя
    user.access_token = access_token
    user.refresh_token = refresh_token
    user.access_token_expire_at = access_token_expire_at
    user.refresh_token_expire_at = refresh_token_expire_at
    user.updated = datetime.now()

    await uow.users.update(user)
    return access_token, refresh_token


async def login_by_credentials(
    cmd: commands.LoginByCredentials,
    uow: AbstractUnitOfWork,
):
    async with uow:
        #  Получаем данные пользователя
        user = await uow.users.get_by_username(cmd.username)

        if not user:
            raise exceptions.UserDoesNotExist

        #  Проверка пароля
        if not hasher.verify(cmd.password, user.password):
            raise exceptions.WrongCredentials

        #  Обновление токенов пользователя
        access_token, refresh_token = await refresh_tokens_of_user(uow, user)
        await uow.commit()

    return command_results.PositiveCommandResult(
        {"access_token": access_token, "refresh_token": refresh_token}
    )


async def logout(
    cmd: commands.Logout,
    uow: AbstractUnitOfWork,
):
    async with uow:
        #  Получаем данные пользователя
        user = await uow.users.get_by_id(cmd.user_id)

        if not user:
            raise exceptions.UserDoesNotExist

        #  Сбрасываем токены
        await dispose_token_pair(uow, user)

    return command_results.PositiveCommandResult({})


async def refresh_tokens(
    cmd: commands.RefreshTokens,
    uow: AbstractUnitOfWork,
):
    async with uow:
        #  Получаем данные пользователя
        user = await uow.users.get_by_id(cmd.user_id)

        if not user:
            raise exceptions.UserDoesNotExist

        #  Обновление токенов пользователя
        try:
            access_token, refresh_token = await refresh_tokens_of_user(
                uow, user
            )
            await uow.commit()
        except Exception as e:
            print(e)

    return command_results.PositiveCommandResult(
        {"access_token": access_token, "refresh_token": refresh_token}
    )


async def verify_token(
    cmd: commands.VerifyToken,
    uow: AbstractUnitOfWork,
):
    async with uow:
        if (
            cmd.is_superuser
            or len(
                set(cmd.required_permissions) - set(cmd.existing_permissions)
            )
            == 0
        ):
            return command_results.PositiveCommandResult({})

        raise exceptions.AuthNoPermissionException
