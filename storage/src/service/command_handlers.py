import logging
import os
from uuid import uuid4

from asyncpg.exceptions import UniqueViolationError

from src.core import exceptions
from src.core.config import settings, tz_now
from src.domain import command_results, commands, events, models
from src.service.uow import AbstractUnitOfWork
from src.tools.hasher import PBKDF2PasswordHasher

logger = logging.getLogger(__name__)
hasher = PBKDF2PasswordHasher()


async def get_many_cdn_servers(
    cmd: commands.GetManyCdnServers,
    uow: AbstractUnitOfWork,
):
    logger.info("Getting CDN servers")
    async with uow:
        objs = await uow.cdn_servers.get_all()

    logger.info(f"Get {len(objs)} CDN servers")
    return command_results.PositiveCommandResult([x.dict() for x in objs])


async def create_cdn_server(
    cmd: commands.CreateCdnServer,
    uow: AbstractUnitOfWork,
):
    logger.info("Creating CDN server")
    async with uow:
        obj = await uow.cdn_servers.get_by_name(cmd.name)

        if obj:
            raise exceptions.CdnServerAlreadyExists

        dt = tz_now()
        obj = models.CdnServer(
            **{**cmd.dict(), **{"id": uuid4(), "created": dt, "updated": dt}},
        )

        await uow.cdn_servers.add(obj)
        await uow.commit()

    logger.info(f"CDN server {obj.dict()} has been created")
    return command_results.PositiveCommandResult(obj.dict())


async def update_cdn_server(
    cmd: commands.UpdateCdnServer,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Updating CDN server with id {cmd.id}")
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.id)

        if not server:
            raise exceptions.CdnServerDoesNotExist

        obj = models.CdnServer(
            **{**server.dict(), **cmd.dict(), **{"updated": tz_now()}},
        )

        await uow.cdn_servers.update(obj)
        await uow.commit()

    logger.info(f"CDN server {obj.dict()} has been updated")
    uow.push_message(events.CdnServerUpdated(id=server.id))
    return command_results.PositiveCommandResult(obj.dict())


async def delete_cdn_server(
    cmd: commands.DeleteCdnServer,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Deleting CDN server with id {cmd.id}")
    async with uow:
        obj = await uow.cdn_servers.get_by_id(cmd.id)

        if not obj:
            raise exceptions.CdnServerDoesNotExist

        await uow.cdn_servers.delete(cmd.id)
        await uow.commit()

    logger.info(f"CDN server {cmd.id} has been deleted")
    return command_results.PositiveCommandResult({})


async def enrich_cdn_server_by_files(
    cmd: commands.EnrichCdnServerByFiles,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Enriching CDN server with id {cmd.id} by files")
    async with uow:
        new_server = await uow.cdn_servers.get_by_id(cmd.id)
        if new_server.is_on and new_server.is_active:
            servers_in_zone = await uow.cdn_servers.get_switched_on(
                True,
                new_server.zone,
            )
            servers_ids_in_zone = [x.id for x in servers_in_zone]

            files_on_servers = {}
            for server_id in servers_ids_in_zone:
                if server_id != new_server.id:
                    files_on_servers[
                        server_id
                    ] = await uow.files.get_non_deleted_on_servers([server_id])

            files_on_new_server = await uow.files.get_non_deleted_on_servers(
                [new_server.id],
            )
            files_ids_on_new_server = {x.id for x in files_on_new_server}

            for server_id in files_on_servers:
                for file in files_on_servers[server_id]:
                    if file.id not in files_ids_on_new_server:
                        logger.info(
                            f"Order file {file.id} to download from "
                            f"CDN server {server_id}",
                        )
                        uow.push_message(
                            commands.OrderFileToDownload(
                                file_id=file.id,
                                server_id=server_id,
                            ),
                        )

    logger.info(f"CDN server with id {cmd.id} has been enriched by files")


async def get_many_files(
    cmd: commands.GetManyFiles,
    uow: AbstractUnitOfWork,
):
    logger.info("Getting files")
    async with uow:
        objs = await uow.files.get_non_deleted(cmd.user_id)

    logger.info(f"Get {len(objs)} files")
    return command_results.PositiveCommandResult(objs)


async def delete_file(
    cmd: commands.DeleteFile,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Deleting file with id {cmd.id}")
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
                },
            ),
        )
        await uow.commit()

    logger.info(f"File {cmd.id} has been deleted")
    uow.push_message(events.FileDeleted(id=cmd.id))
    return command_results.PositiveCommandResult({})


async def rename_file(
    cmd: commands.RenameFile,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Renaming file with id {cmd.id}")
    async with uow:
        obj = await uow.files.get_by_id(cmd.id)

        if not obj or obj.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        old_name = obj.name

        obj.name = cmd.name

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
                },
            ),
        )
        await uow.commit()

    logger.info(f"File {cmd.id} has been renamed")
    return command_results.PositiveCommandResult(obj.dict())


async def get_file_servers(
    cmd: commands.GetFileServers,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Getting servers where file {cmd.id} is located")
    async with uow:
        objs = []
        ids_of_servers = await uow.files.get_ids_of_servers(cmd.id)

        if ids_of_servers:
            servers = await uow.cdn_servers.get_all()
            objs = [x for x in servers if x.id in ids_of_servers]

    logger.info(f"File {cmd.id} is located on {len(objs)} servers")
    return command_results.PositiveCommandResult(objs)


async def get_upload_link(
    cmd: commands.GetUploadLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        coordinates = await uow.geoip.get_info(cmd.ip)
        nearest_server = await uow.cdn_servers.get_nearest(coordinates)
        logger.info(
            f"Get upload link for file {cmd.name} on "
            f"server {nearest_server.name}",
        )

        obj = await uow.files.get_non_deleted_by_name_and_user_id(
            cmd.name,
            cmd.user_id,
        )
        is_new = False if obj else True

        dt = tz_now()

        if is_new:
            obj = models.File(
                id=uuid4(),
                name=cmd.name,
                size=cmd.size,
                user_id=cmd.user_id,
                has_deleted=False,
                created=dt,
                updated=dt,
            )
            await uow.files.add(obj)

        else:
            obj.size = cmd.size
            obj.updated = dt
            await uow.files.update(obj)

        storage = await uow.s3_pool.get(
            nearest_server.name,
            nearest_server.host,
            nearest_server.port,
        )
        link = await storage.get_upload_url(str(obj.id))
        await uow.files.remove_all_servers_from_file(obj.id)

        await uow.history.add(
            models.FileUploadedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"name": obj.name},
                },
            ),
        )

        await uow.commit()

    return command_results.PositiveCommandResult({"file": obj, "link": link})


async def get_user_actions(
    cmd: commands.GetUserActions,
    uow: AbstractUnitOfWork,
):
    logger.info("Getting user actions")
    async with uow:
        objs = await uow.history.get(cmd.user_id, cmd.limit, cmd.offset)
        count = await uow.history.count(cmd.user_id)

    return command_results.PositiveCommandResult(
        {"count": count, "data": [x.dict() for x in objs]},
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
            coordinates,
            only_servers=ids_of_servers,
        )
        storage = await uow.s3_pool.get(
            nearest_server.name,
            nearest_server.host,
            nearest_server.port,
        )

        logger.info(
            f"Get download link for file {cmd.file_id} on "
            f"server {nearest_server.name}",
        )
        link = await storage.get_download_url(str(obj.id))

        await uow.history.add(
            models.FileDownloadedUserAction(
                **{
                    "obj_id": obj.id,
                    "user_id": obj.user_id,
                    "data": {"name": obj.name},
                },
            ),
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
    logger.info(
        f"Handling S3 event with key {cmd.routing_key}, body {cmd.body}",
    )
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
            events_mapping[action](id=key, storage_name=storage_name),
        )

    return command_results.PositiveCommandResult({})


async def handle_service_event(
    cmd: commands.HandleServiceEvent,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Handling service event with key {cmd.routing_key}, body {cmd.body}",
    )

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
    logger.info(f"Marking file with id {cmd.file_id} as stored")
    async with uow:
        await uow.files.add_server_to_file(cmd.file_id, cmd.server_id)

        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        ids_of_servers_where_file_located = await uow.files.get_ids_of_servers(
            cmd.file_id,
        )
        ids_of_servers_in_zone = [
            x.id
            for x in await uow.cdn_servers.get_switched_on(True, server.zone)
        ]

        await uow.commit()

    if (
        len(
            set(ids_of_servers_in_zone)
            - set(ids_of_servers_where_file_located),
        )
        == 0
    ):
        uow.push_message(events.FileDistributed(id=cmd.file_id))
    else:
        if len(ids_of_servers_where_file_located) == 1:
            uow.push_message(
                commands.OrderFileToDownload(
                    file_id=cmd.file_id,
                    server_id=cmd.server_id,
                ),
            )

    return command_results.PositiveCommandResult({})


async def order_file_to_download(
    cmd: commands.OrderFileToDownload,
    uow: AbstractUnitOfWork,
):
    logger.info("Ordering file to download")
    message = models.FileOrderedToDownloadBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def download_file_to_temp_storage(
    cmd: commands.DownloadFileToTempStorage,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Downloading file with id {cmd.file_id} from "
        f"server with id {cmd.server_id}",
    )
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        storage = await uow.s3_pool.get(server.name, server.host, server.port)
        filename = str(cmd.file_id)
        path = os.path.join(settings.storage_path, filename)
        await storage.download_file(filename, path)

    uow.push_message(
        events.FileDownloadedToTempStorage(id=cmd.file_id, zone=server.zone),
    )
    logger.info(
        f"File with id {cmd.file_id} has been downloaded to temp storage",
    )
    return command_results.PositiveCommandResult({})


async def distribute_file_within_zone(
    cmd: commands.DistributeFileWithinZone,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Distributing file with id {cmd.file_id} with own zone")
    async with uow:
        file_on_servers_ids = await uow.files.get_ids_of_servers(cmd.file_id)
        servers_in_zone = await uow.cdn_servers.get_switched_on(True, cmd.zone)

        for server in servers_in_zone:
            if server.id not in file_on_servers_ids:
                uow.push_message(
                    commands.OrderFileToCopy(
                        file_id=cmd.file_id,
                        server_id=server.id,
                    ),
                )

    logger.info(f"File with id {cmd.file_id} has been distributed")
    return command_results.PositiveCommandResult({})


async def order_file_to_copy(
    cmd: commands.OrderFileToCopy,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Ordering file with id {cmd.file_id} to "
        f"copy to server with id {cmd.server_id}",
    )
    message = models.FileOrderedToCopyBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def copy_file(
    cmd: commands.CopyFile,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Coping file with id {cmd.file_id} to "
        f"copy to server with id {cmd.server_id}",
    )
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)
        storage = await uow.s3_pool.get(server.name, server.host, server.port)
        filename = str(cmd.file_id)
        path = os.path.join(settings.storage_path, filename)
        await storage.upload_file(filename, path)

    logger.info(
        f"File with id {cmd.file_id} has been "
        f"copied to server with id {cmd.server_id}",
    )
    return command_results.PositiveCommandResult({})


async def remove_file_from_temp_storage(
    cmd: commands.RemoveFileFromTempStorage,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Removing file with id {cmd.file_id} from temp storage")
    filename = str(cmd.file_id)
    path = os.path.join(settings.storage_path, filename)
    try:
        for root, dirs, files in os.walk(path):
            print(root, dirs, files)

        os.remove(path)
        logger.info(
            f"File with id {cmd.file_id} has been removed temp storage",
        )

    except FileNotFoundError:
        logger.warning(
            f"File with id {cmd.file_id} was not found in temp storage",
        )
        pass

    return command_results.PositiveCommandResult({})


async def order_file_to_remove(
    cmd: commands.OrderFileToRemove,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Ordering file with id {cmd.file_id} to "
        f"remove from server with id {cmd.server_id}",
    )
    message = models.FileOrderedToRemoveBrokerMessage(message=cmd.dict())
    uow.push_message(commands.PublishMessage(message=message))
    return command_results.PositiveCommandResult({})


async def remove_file(
    cmd: commands.RemoveFile,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Removing file with id {cmd.file_id} from "
        f"server with id {cmd.server_id}",
    )
    async with uow:
        server = await uow.cdn_servers.get_by_id(cmd.server_id)

        if server.is_on:
            storage = await uow.s3_pool.get(
                server.name,
                server.host,
                server.port,
            )
            await storage.remove_file(str(cmd.file_id))

    logger.info(
        f"File with id {cmd.file_id} has been removed "
        f"from server with id {cmd.server_id}",
    )
    return command_results.PositiveCommandResult({})


async def mark_file_as_removed(
    cmd: commands.MarkFileAsRemoved,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Marking file with id {cmd.file_id} as removed from server "
        f"with id {cmd.server_id}",
    )
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
    logger.info(f"Creating share link for file with id {cmd.file_id}")
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file or file.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        hashed_password = (
            hasher.encode(cmd.password, hasher.salt())
            if cmd.password
            else None
        )

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
                },
            ),
        )

        await uow.commit()

    logger.info(f"Share link for file with id {cmd.file_id} has been created")
    return command_results.PositiveCommandResult(
        make_share_link_result(obj, file),
    )


async def get_file_share_links(
    cmd: commands.GetFileShareLinks,
    uow: AbstractUnitOfWork,
):
    logger.info(f"Gettings share links for file with id {cmd.file_id}")
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file or file.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        objs = await uow.file_share_links.get_many(cmd.file_id)

    logger.info(f"Get {len(objs)} share links for file with id {cmd.file_id}")
    return command_results.PositiveCommandResult(
        [make_share_link_result(x, file) for x in objs],
    )


async def get_file_share_link(
    cmd: commands.GetFileShareLink,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Getting single share link {cmd.link_id} for "
        f"file with id {cmd.file_id}"
    )
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file:
            raise exceptions.FileDoesNotExist
        

        link = await uow.file_share_links.get(cmd.file_id, cmd.link_id)
        if not link or (
            link.expire_at is not None and link.expire_at <= tz_now()
        ):
            raise exceptions.FileShareLinkDoesNotExist

    logger.info(
        f"Info about share link {cmd.link_id} for file "
        f"with id {cmd.file_id} has been returned",
    )
    return command_results.PositiveCommandResult(
        make_share_link_result(link, file),
    )


async def delete_file_share_link(
    cmd: commands.DeleteFileShareLink,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Deleting share link {cmd.link_id} for file with id {cmd.file_id}",
    )
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
                },
            ),
        )
        await uow.commit()

    logger.info(
        f"Share link {cmd.link_id} for file "
        f"with id {cmd.file_id} has been deleted",
    )
    return command_results.PositiveCommandResult({})


async def validate_file_share_link(
    cmd: commands.ValidateFileShareLink,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"Validating share link {cmd.link_id} for file with id {cmd.file_id}",
    )
    async with uow:
        file = await uow.files.get_by_id(cmd.file_id)
        if not file:
            raise exceptions.FileDoesNotExist

        link = await uow.file_share_links.get(cmd.file_id, cmd.link_id)

        if not link or (
            link.expire_at is not None and link.expire_at <= tz_now()
        ):
            raise exceptions.FileShareLinkDoesNotExist

        if link.password:
            if not cmd.password or not hasher.verify(
                cmd.password,
                link.password,
            ):
                raise exceptions.AuthNoPermissionException

    logger.info(
        f"Share link {cmd.link_id} for file "
        f"with id {cmd.file_id} has been validated",
    )
    return command_results.PositiveCommandResult({})
