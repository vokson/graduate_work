import logging

# from src.core import exceptions
# from src.core.config import settings
from src.domain import commands, events
# from src.domain.models import CdnServer, File, BrokerMessage, FileStoredBrokerMessage
from src.service.uow import AbstractUnitOfWork


logger = logging.getLogger(__name__)


async def file_stored(
    cmd: events.FileStored,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file_on_servers = await uow.files.get_ids_of_servers(cmd.id)
        current_server = await uow.cdn_servers.get_by_name(cmd.storage_name)

        data = {"file_id": cmd.id, "server_id": current_server.id}
        uow.push_message(commands.MarkFileAsStored(**data))

        if not file_on_servers:
            uow.push_message(commands.OrderFileToDownload(**data))


async def file_downloaded_to_temp_storage(
    cmd: events.FileDownloadedToTempStorage,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file_on_servers_ids = await uow.files.get_ids_of_servers(cmd.id)
        all_servers = await uow.cdn_servers.get_all()

        for server in all_servers:
            if server.id not in file_on_servers_ids:
                uow.push_message(
                    commands.OrderFileToCopy(
                        file_id=cmd.id,
                        server_id=server.id,
                    )
                )


async def file_distributed(
    cmd: events.FileDistributed,
    uow: AbstractUnitOfWork,
):
    uow.push_message(
        commands.RemoveFileFromTempStorage(
            file_id=cmd.id,
        )
    )


async def file_deleted(
    cmd: events.FileDeleted,
    uow: AbstractUnitOfWork,
):
    async with uow:
        file_on_servers_ids = await uow.files.get_ids_of_servers(cmd.id)

        for server_id in file_on_servers_ids:
            uow.push_message(
                commands.OrderFileToRemove(
                    file_id=cmd.id,
                    server_id=server_id,
                )
            )


async def file_removed_from_storage(
    cmd: events.FileRemovedFromStorage,
    uow: AbstractUnitOfWork,
):
    async with uow:
        current_server = await uow.cdn_servers.get_by_name(cmd.storage_name)
        data = {"file_id": cmd.id, "server_id": current_server.id}
        uow.push_message(commands.MarkFileAsRemoved(**data))
