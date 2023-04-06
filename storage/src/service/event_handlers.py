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
        print(cmd.id, cmd.storage_name)

async def file_removed_from_storage(
    cmd: events.FileRemovedFromStorage,
    uow: AbstractUnitOfWork,
):
    async with uow:
        print(cmd.id, cmd.storage_name)

