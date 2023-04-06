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
        if file_on_servers:
            return

        all_servers = await uow.cdn_servers.get_all()
        current_server = await uow.cdn_servers.get_by_name(cmd.storage_name)

        for server in all_servers:
            if server.name == cmd.storage_name:
                uow.push_message(
                    commands.MarkFileAsStored(
                        file_id=cmd.id, server_id=server.id
                    )
                )
            else:
                uow.push_message(
                    commands.OrderFileToCopy(
                        file_id=cmd.id,
                        from_server_id=current_server.id,
                        to_server_id=server.id,
                    )
                )


async def file_removed_from_storage(
    cmd: events.FileRemovedFromStorage,
    uow: AbstractUnitOfWork,
):
    async with uow:
        print(cmd.id, cmd.storage_name)
