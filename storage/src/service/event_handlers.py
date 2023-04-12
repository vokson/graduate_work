import logging

from src.domain import commands, events
from src.service.uow import AbstractUnitOfWork

logger = logging.getLogger(__name__)


async def cdn_server_updated(
    cmd: events.CdnServerUpdated,
    uow: AbstractUnitOfWork,
):
    logger.info(f"CDN server {cmd.id} updated")
    uow.push_message(commands.EnrichCdnServerByFiles(id=cmd.id))


async def file_stored(
    cmd: events.FileStored,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"File {cmd.id} has been stored on CDN server {cmd.storage_name}",
    )
    async with uow:
        current_server = await uow.cdn_servers.get_by_name(cmd.storage_name)
        data = {"file_id": cmd.id, "server_id": current_server.id}
        uow.push_message(commands.MarkFileAsStored(**data))


async def file_downloaded_to_temp_storage(
    cmd: events.FileDownloadedToTempStorage,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"File {cmd.id} of zone {cmd.zone} has "
        "been downloaded to temp storage",
    )
    uow.push_message(
        commands.DistributeFileWithinZone(
            file_id=cmd.id,
            zone=cmd.zone,
        ),
    )


async def file_distributed(
    cmd: events.FileDistributed,
    uow: AbstractUnitOfWork,
):
    logger.info(f"File {cmd.id} has been distributed")
    uow.push_message(
        commands.RemoveFileFromTempStorage(
            file_id=cmd.id,
        ),
    )


async def file_deleted(
    cmd: events.FileDeleted,
    uow: AbstractUnitOfWork,
):
    logger.info(f"File {cmd.id} has been deleted")
    async with uow:
        file_on_servers_ids = await uow.files.get_ids_of_servers(cmd.id)

        for server_id in file_on_servers_ids:
            uow.push_message(
                commands.OrderFileToRemove(
                    file_id=cmd.id,
                    server_id=server_id,
                ),
            )


async def file_removed_from_storage(
    cmd: events.FileRemovedFromStorage,
    uow: AbstractUnitOfWork,
):
    logger.info(
        f"File {cmd.id} has been removed from storage {cmd.storage_name}",
    )
    async with uow:
        current_server = await uow.cdn_servers.get_by_name(cmd.storage_name)
        data = {"file_id": cmd.id, "server_id": current_server.id}
        uow.push_message(commands.MarkFileAsRemoved(**data))
