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
            host=cmd.host,
            port=cmd.port,
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


# async def create_file(
#     cmd: commands.CreateFile,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         obj = File(
#             id=uuid4(),
#             name=cmd.name,
#             size=cmd.size,
#             servers=cmd.servers
#         )

#         await uow.files.add(obj)
#         await uow.commit()

#     return command_results.PositiveCommandResult(obj.dict())


async def get_many_files(
    cmd: commands.GetManyFiles,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.files.get_all(cmd.user_id)

    return command_results.PositiveCommandResult([x.dict() for x in objs])


async def delete_file(
    cmd: commands.DeleteFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.files.get_by_id(cmd.id)
        if not obj:
            raise exceptions.FileDoesNotExist

        if obj.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        await uow.files.delete(cmd.id)
        await uow.commit()

    return command_results.PositiveCommandResult({})

async def get_file_servers(
    cmd: commands.GetFileServers,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = []
        ids_of_servers = await uow.files.get_ids_of_servers(cmd.id)

        if ids_of_servers:
            servers = await uow.cdn_servers.get_all()
            objs = [x for x in servers if x.id in ids_of_servers]

    return command_results.PositiveCommandResult([x.dict() for x in objs])


async def get_upload_link(
    cmd: commands.GetUploadLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        coordinates = await uow.geoip.get_info(cmd.ip)
        nearest_server = await uow.cdn_servers.get_nearest(coordinates)
        logger.info(
            f"Get upload link for file {cmd.name} on server {nearest_server.name}"
        )

        storage = await uow.s3_pool.get(
            nearest_server.name, nearest_server.host, nearest_server.port
        )
        print(storage)
        link = await storage.get_upload_url(cmd.name)
        # link = uow.s3.get_upload_url(cmd.name)
        obj = await uow.files.get_by_name_and_user_id(cmd.name, cmd.user_id)
        is_new = False if obj else True

        dt = datetime.now()

        if is_new:
            obj = File(
                id=uuid4(),
                name=cmd.name,
                size=cmd.size,
                user_id=cmd.user_id,
                created=dt,
                updated=dt,
                # servers=[]
            )
            await uow.files.add(obj)

        else:
            obj.size = cmd.size
            obj.updated = dt
            # obj.servers = []
            await uow.files.update(obj)

        await uow.commit()

    return command_results.PositiveCommandResult({"file": obj, "link": link})
