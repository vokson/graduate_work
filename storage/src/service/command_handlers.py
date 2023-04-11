import asyncio
import logging
import os
import time
from collections import deque
from datetime import datetime
from uuid import UUID, uuid4

import jwt
from asyncpg.exceptions import PostgresError, UniqueViolationError
from src.adapters.s3 import AbstractS3Storage
from src.core import exceptions
from src.core.config import settings
from src.domain import command_results, commands, events, models
from src.service.uow import AbstractUnitOfWork
from src.tools.hasher import PBKDF2PasswordHasher


logger = logging.getLogger(__name__)
hasher = PBKDF2PasswordHasher()


async def create_cdn_server(
    cmd: commands.CreateCdnServer,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.cdn_servers.get_by_name(cmd.name)

        if obj:
            raise exceptions.CdnServerAlreadyExists

        obj = models.CdnServer(
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


async def get_many_files(
    cmd: commands.GetManyFiles,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.files.get_non_deleted(cmd.user_id)

    return command_results.PositiveCommandResult(objs)


async def delete_file(
    cmd: commands.DeleteFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.files.get_by_id(cmd.id)

        if not obj or obj.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        await uow.files.delete(cmd.id)
        await uow.history.add(
            models.FileDeletedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"name": obj.name},
                }
            )
        )
        await uow.commit()

    uow.push_message(events.FileDeleted(id=cmd.id))
    return command_results.PositiveCommandResult({})

async def rename_file(
    cmd: commands.RenameFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.files.get_by_id(cmd.id)

        if not obj or obj.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        old_name = obj.name

        obj.name = cmd.name
        obj.updated = datetime.now()

        try:
            await uow.files.update(obj)
        except UniqueViolationError:
            raise exceptions.FileAlreadyExists

        await uow.history.add(
            models.FileRenamedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"old_name": old_name, "new_name": cmd.name},
                }
            )
        )
        await uow.commit()

    return command_results.PositiveCommandResult(obj.dict())


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

    return command_results.PositiveCommandResult(objs)


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

        obj = await uow.files.get_by_name_and_user_id(cmd.name, cmd.user_id)
        is_new = False if obj else True

        dt = datetime.now()

        if is_new:
            obj = models.File(
                id=uuid4(),
                name=cmd.name,
                size=cmd.size,
                user_id=cmd.user_id,
                created=dt,
                updated=dt,
            )
            await uow.files.add(obj)

        else:
            obj.size = cmd.size
            obj.updated = dt
            await uow.files.update(obj)

        storage = await uow.s3_pool.get(
            nearest_server.name, nearest_server.host, nearest_server.port
        )
        link = await storage.get_upload_url(str(obj.id))
        await uow.files.remove_all_servers_from_file(obj.id)

        await uow.history.add(
            models.FileUploadedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"name": obj.name},
                }
            )
        )

        await uow.commit()

    return command_results.PositiveCommandResult({"file": obj, "link": link})


async def get_user_actions(
    cmd: commands.GetUserActions,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.history.get(cmd.user_id, cmd.limit, cmd.offset)
        count = await uow.history.count(cmd.user_id)

    return command_results.PositiveCommandResult(
        {"count": count, "data": [x.dict() for x in objs]}
    )


async def get_download_link(
    cmd: commands.GetDownloadLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.files.get_by_id(cmd.file_id)
        ids_of_servers = await uow.files.get_ids_of_servers(cmd.file_id)

        if not (obj and ids_of_servers):
            raise exceptions.FileDoesNotExist

        coordinates = await uow.geoip.get_info(cmd.ip)
        nearest_server = await uow.cdn_servers.get_nearest(
            coordinates, only_servers=ids_of_servers
        )
        storage = await uow.s3_pool.get(
            nearest_server.name, nearest_server.host, nearest_server.port
        )

        logger.info(
            f"Get download link for file {cmd.file_id} on server {nearest_server.name}"
        )
        link = await storage.get_download_url(str(obj.id))

        await uow.history.add(
            models.FileDownloadedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"name": obj.name},
                }
            )
        )

        await uow.commit()

    return command_results.PositiveCommandResult({"file": obj, "link": link})


async def publish_message(
    cmd: commands.PublishMessage,
    uow: AbstractUnitOfWork,
):
    app = cmd.message.app
    key = f"{settings.app_name}.{cmd.message.key}"
    message = cmd.message.message

    is_ok = await uow.publisher.push_message(app, key, message)

    if not is_ok:
        logger.error(f"Error when publish message {message} with key {key}")
        raise exceptions.PublishMessageError

    logger.info(f"Message {message} with key {key} has been published")
    return command_results.PositiveCommandResult({})


async def handle_s3_event(
    cmd: commands.HandleS3Event,
    uow: AbstractUnitOfWork,
):
    async with uow:
        try:
            storage_name = cmd.routing_key.split(".", 2)[1]
            event_name = cmd.body["EventName"]
            action = event_name.split(":", 2)[1]
            key = cmd.body["Key"].split("/", 1)[1]

        except Exception as e:
            logger.error(f"Error during parsing of S3 event {cmd.body}")
            logger.info(e)
            raise exceptions.BadS3Event

        events_mapping = {
            "ObjectCreated": events.FileStored,
            "ObjectRemoved": events.FileRemovedFromStorage,
        }

        if action not in events_mapping:
            raise exceptions.BadS3Event

        uow.push_message(
            events_mapping[action](id=key, storage_name=storage_name)
        )

    return command_results.PositiveCommandResult({})


async def handle_service_event(
    cmd: commands.HandleServiceEvent,
    uow: AbstractUnitOfWork,
):
    key = cmd.routing_key.split(".", 1)[1]

    events_mapping = {
        "FILE.ORDERED_TO_DOWNLOAD": commands.DownloadFileToTempStorage,
        "FILE.ORDERED_TO_COPY": commands.CopyFile,
        "FILE.ORDERED_TO_REMOVE": commands.RemoveFile,
    }

    if key not in events_mapping:
        raise exceptions.BadServiceEvent

    uow.push_message(events_mapping[key](**cmd.body))

    return command_results.PositiveCommandResult({})


async def mark_file_as_stored(
    cmd: commands.MarkFileAsStored,
    uow: AbstractUnitOfWork,
):
    async with uow:
        await uow.files.add_server_to_file(cmd.file_id, cmd.server_id)
        if await uow.files.is_copied(cmd.file_id):
            uow.push_message(events.FileDistributed(id=cmd.file_id))

        await uow.commit()

    return command_results.PositiveCommandResult({})


async def order_file_to_download(
    cmd: commands.OrderFileToDownload,
    uow: AbstractUnitOfWork,
):
    message = models.FileOrderedToDownloadBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def download_file_to_temp_storage(
    cmd: commands.DownloadFileToTempStorage,
    uow: AbstractUnitOfWork,
):
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        storage = await uow.s3_pool.get(server.name, server.host, server.port)
        filename = str(cmd.file_id)
        path = os.path.join(settings.storage_path, filename)
        await storage.download_file(filename, path)
        uow.push_message(events.FileDownloadedToTempStorage(id=cmd.file_id))

    return command_results.PositiveCommandResult({})


async def order_file_to_copy(
    cmd: commands.OrderFileToCopy,
    uow: AbstractUnitOfWork,
):
    message = models.FileOrderedToCopyBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def copy_file(
    cmd: commands.CopyFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        storage = await uow.s3_pool.get(server.name, server.host, server.port)
        filename = str(cmd.file_id)
        path = os.path.join(settings.storage_path, filename)
        await storage.upload_file(filename, path)

    return command_results.PositiveCommandResult({})


async def remove_file_from_temp_storage(
    cmd: commands.RemoveFileFromTempStorage,
    uow: AbstractUnitOfWork,
):
    filename = str(cmd.file_id)
    path = os.path.join(settings.storage_path, filename)
    try:
        os.remove(path)
    except FileNotFoundError:
        raise exceptions.FileNotFoundInTempStorage

    return command_results.PositiveCommandResult({})


async def order_file_to_remove(
    cmd: commands.OrderFileToRemove,
    uow: AbstractUnitOfWork,
):
    message = models.FileOrderedToRemoveBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def remove_file(
    cmd: commands.RemoveFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        storage = await uow.s3_pool.get(server.name, server.host, server.port)
        await storage.remove_file(str(cmd.file_id))

    return command_results.PositiveCommandResult({})


async def mark_file_as_removed(
    cmd: commands.MarkFileAsRemoved,
    uow: AbstractUnitOfWork,
):
    async with uow:
        await uow.files.remove_server_from_file(cmd.file_id, cmd.server_id)
        await uow.commit()

    return command_results.PositiveCommandResult({})


def make_share_link_result(link: models.FileShareLink, file: models.File):
    return {
        **link.dict(),
        **{"file": file.dict(), "is_secured": link.password is not None},
    }


async def create_file_share_link(
    cmd: commands.CreateFileShareLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file or file.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        hashed_password = hasher.encode(cmd.password, hasher.salt()) if cmd.password else None

        obj = models.FileShareLink(
            file_id=cmd.file_id,
            password=hashed_password,
            expire_at=cmd.expire_at,
        )

        await uow.file_share_links.add(obj)

        await uow.history.add(
            models.FileShareLinkCreatedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": cmd.user_id,
                    "data": {"name": file.name, "created": obj.created},
                }
            )
        )

        await uow.commit()

    return command_results.PositiveCommandResult(
        make_share_link_result(obj, file)
    )


async def get_file_share_links(
    cmd: commands.GetFileShareLinks,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file or file.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        objs = await uow.file_share_links.get_many(cmd.file_id)

    return command_results.PositiveCommandResult(
        [make_share_link_result(x, file) for x in objs]
    )


async def get_file_share_link(
    cmd: commands.GetFileShareLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file:
            raise exceptions.FileDoesNotExist

        link = await uow.file_share_links.get(cmd.file_id, cmd.link_id)
        if not link or (link.expire_at is not None and link.expire_at <= datetime.now()):
            raise exceptions.FileShareLinkDoesNotExist

    return command_results.PositiveCommandResult(
        make_share_link_result(link, file)
    )


async def delete_file_share_link(
    cmd: commands.DeleteFileShareLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file or file.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        link = await uow.file_share_links.get(cmd.file_id, cmd.link_id)
        if not link:
            raise exceptions.FileShareLinkDoesNotExist

        await uow.file_share_links.delete(cmd.link_id)
        
        await uow.history.add(
            models.FileShareLinkDeletedUserAction(
                **{
                    "obj_id": cmd.link_id,
                    "user_id": cmd.user_id,
                    "data": {"name": file.name, "created": link.created},
                }
            )
        )
        await uow.commit()

    return command_results.PositiveCommandResult({})

async def validate_file_share_link(
    cmd: commands.ValidateFileShareLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file:
            raise exceptions.FileDoesNotExist

        link = await uow.file_share_links.get(cmd.file_id, cmd.link_id)

        if not link or (link.expire_at is not None and link.expire_at <= datetime.now()):
            raise exceptions.FileShareLinkDoesNotExist

        if link.password:
            if not cmd.password or not hasher.verify(cmd.password, link.password):
                raise exceptions.AuthNoPermissionException


    return command_results.PositiveCommandResult({})
