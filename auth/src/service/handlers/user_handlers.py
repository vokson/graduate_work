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
            is_superuser=False,
            created=datetime.now(),
        )

        await uow.users.add(user)
        await uow.commit()

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
    # perms = set()

    # for role in user["roles"]:
    #     for permission in role["permissions"]:
    #         perms.add(permission["name"])

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


async def login_by_credentials(
    cmd: commands.LoginByCredentials,
    uow: AbstractUnitOfWork,
):
    async with uow:
        user = await uow.users.get_by_username(cmd.username)

        if not user:
            raise exceptions.UserDoesNotExists

        if not hasher.verify(cmd.password, user.password):
            raise exceptions.WrongCredentials

        permissions = ["can_view", "can_add"]

        (
            access_token,
            refresh_token,
            access_token_expire_at,
            refresh_token_expire_at,
        ) = generate_token_pair(user.id, user.is_superuser, permissions)

        await dispose_token_pair(uow, user)

        user.access_token = access_token
        user.refresh_token = refresh_token
        user.access_token_expire_at = access_token_expire_at
        user.refresh_token_expire_at = refresh_token_expire_at
        user.updated = datetime.now()

        await uow.users.update(user)
        await uow.commit()

    return command_results.PositiveCommandResult(
        {"access_token": access_token, "refresh_token": refresh_token}
    )


async def dispose_token_pair(
    uow: AbstractUnitOfWork,
    user: User,
):
    await uow.cache.set(
        user.access_token,
        1,
        expire_at=user.access_token_expire_at,
    )
    await uow.cache.set(
        user.refresh_token,
        1,
        expire_at=user.refresh_token_expire_at,
    )
