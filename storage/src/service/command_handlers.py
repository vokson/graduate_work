import logging
import time
from datetime import datetime
from uuid import UUID, uuid4

import jwt
from asyncpg.exceptions import PostgresError
from src.core import exceptions
from src.core.config import settings
from src.domain import command_results, commands, events
from src.domain.models import CdnServer, File
from src.service.uow import AbstractUnitOfWork


logger = logging.getLogger(__name__)


async def create_cdn_server(
    cmd: commands.CreateCdnServer,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.cdn_servers.get_by_name(cmd.name)

        if obj:
            raise exceptions.CdnServerAlreadyExists

        obj = CdnServer(
            id=uuid4(),
            name=cmd.name,
            location=cmd.location,
            latitude=cmd.latitude,
            longitude=cmd.longitude,
        )

        await uow.cdn_servers.add(obj)
        await uow.commit()

    return command_results.PositiveCommandResult(obj.dict())

async def get_many_cdn_servers(
    cmd: commands.GetManyCdnServers,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.cdn_servers.get_all()

    return command_results.PositiveCommandResult([x.dict() for x in objs])

async def create_file(
    cmd: commands.CreateFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = File(
            id=uuid4(),
            name=cmd.name,
            size=cmd.size,
            servers=cmd.servers
        )

        await uow.files.add(obj)
        await uow.commit()

    return command_results.PositiveCommandResult(obj.dict())

async def get_many_files(
    cmd: commands.GetManyFiles,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.files.get_all()
        # await uow.commit()

    return command_results.PositiveCommandResult([x.dict() for x in objs])

# async def get_user_by_id(
#     cmd: commands.GetUserById,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         user = await uow.users.get_by_id(cmd.user_id)

#         if not user:
#             raise exceptions.UserDoesNotExists

#     return command_results.PositiveCommandResult(
#         user.dict(exclude={"password"})
#     )


# def encode_token(payload: dict) -> str:
#     return jwt.encode(
#         payload,
#         settings.token.secret_key,
#         algorithm=settings.token.algo,
#     )


# def generate_token_pair(
#     user_id: UUID,
#     is_superuser: bool,
#     perms: list[str],
# ) -> tuple[str, str, int, int]:
#     timestamp = round(time.time())
#     base_token = {
#         "user_id": str(user_id),
#         #  Минус секунда для компенсации рассинхрона
#         #  времени на разных серверах
#         "iat": timestamp - 1,
#         "permissions": perms,
#         "is_superuser": is_superuser,
#     }

#     access_token_expire_at = timestamp + settings.token.access_lifetime
#     access_token = {
#         **base_token,
#         **{
#             "exp": access_token_expire_at,
#             "token_type": "access",
#         },
#     }

#     refresh_token_expire_at = timestamp + settings.token.refresh_lifetime
#     refresh_token = {
#         **base_token,
#         **{
#             "exp": refresh_token_expire_at,
#             "token_type": "refresh",
#         },
#     }

#     return (
#         encode_token(access_token),
#         encode_token(refresh_token),
#         access_token_expire_at,
#         refresh_token_expire_at,
#     )


# async def dispose_token_pair(
#     uow: AbstractUnitOfWork,
#     user: User,
# ):
#     if user.access_token:
#         await uow.cache.set(
#             user.access_token,
#             1,
#             expire_at=user.access_token_expire_at,
#         )
#     if user.refresh_token:
#         await uow.cache.set(
#             user.refresh_token,
#             1,
#             expire_at=user.refresh_token_expire_at,
#         )


# async def refresh_tokens_of_user(
#     uow: AbstractUnitOfWork,
#     user: User,
# ):
#     #  Генерируем новые токены
#     (
#         access_token,
#         refresh_token,
#         access_token_expire_at,
#         refresh_token_expire_at,
#     ) = generate_token_pair(user.id, user.is_superuser, user.permissions)

#     #  Сбрасываем старые токены
#     await dispose_token_pair(uow, user)

#     #  Обновляем данные пользователя
#     user.access_token = access_token
#     user.refresh_token = refresh_token
#     user.access_token_expire_at = access_token_expire_at
#     user.refresh_token_expire_at = refresh_token_expire_at
#     user.updated = datetime.now()

#     await uow.users.update(user)
#     return access_token, refresh_token


# async def login_by_credentials(
#     cmd: commands.LoginByCredentials,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         #  Получаем данные пользователя
#         user = await uow.users.get_by_username(cmd.username)

#         if not user:
#             raise exceptions.UserDoesNotExists

#         #  Проверка пароля
#         if not hasher.verify(cmd.password, user.password):
#             raise exceptions.WrongCredentials

#         #  Обновление токенов пользователя
#         access_token, refresh_token = await refresh_tokens_of_user(uow, user)
#         await uow.commit()

#     return command_results.PositiveCommandResult(
#         {"access_token": access_token, "refresh_token": refresh_token}
#     )

# async def logout(
#     cmd: commands.Logout,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         #  Получаем данные пользователя
#         user = await uow.users.get_by_id(cmd.user_id)

#         if not user:
#             raise exceptions.UserDoesNotExists

#         #  Сбрасываем токены
#         await dispose_token_pair(uow, user)

#     return command_results.PositiveCommandResult({})


# async def refresh_tokens(
#     cmd: commands.RefreshTokens,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         #  Получаем данные пользователя
#         user = await uow.users.get_by_id(cmd.user_id)

#         if not user:
#             raise exceptions.UserDoesNotExists

#         #  Обновление токенов пользователя
#         access_token, refresh_token = await refresh_tokens_of_user(uow, user)
#         await uow.commit()

#     return command_results.PositiveCommandResult(
#         {"access_token": access_token, "refresh_token": refresh_token}
#     )


# async def verify_token(
#     cmd: commands.VerifyToken,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         if (
#             cmd.is_superuser
#             or len(
#                 set(cmd.required_permissions) - set(cmd.existing_permissions)
#             )
#             == 0
#         ):
#             return command_results.PositiveCommandResult({})

#         raise exceptions.AuthNoPermissionException
