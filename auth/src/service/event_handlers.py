"""
Event handlers for message bus.

Coroutines handle Event message from message bus must be placed here.

Example:
    async def file_stored(
        cmd: events.FileStored,
        uow: uow.AbstractUnitOfWork,
    ):
        async with uow:
            server = await uow.servers.get_by_name(cmd.storage_name)
            data = {"file_id": cmd.id, "server_id": server.id}
            uow.push_message(commands.MarkFileAsStored(**data))

Parameters:
    cmd: events.Event,
        Event message
    uow: uow.AbstractUnitOfWork
        Unit of Work

Returns:
    None
        Event handler should return None


"""

import logging

logger = logging.getLogger(__name__)
