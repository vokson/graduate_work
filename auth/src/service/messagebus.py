# from __future__ import annotations
import logging
from typing import Callable, Type

from src.domain import commands, events
from src.service.handlers import user_handlers
from src.service.uow import AbstractUnitOfWork, UnitOfWork


# if TYPE_CHECKING:
#     from . import unit_of_work

logger = logging.getLogger(__name__)

Message = commands.Command | events.Event


EVENT_HANDLERS = {
    # events.Allocated: [handlers.publish_allocated_event],
    # events.OutOfStock: [handlers.send_out_of_stock_notification],
}

COMMAND_HANDLERS = {
    commands.CreateUser: user_handlers.create_user,
    # commands.Allocate: handlers.allocate,
    # commands.CreateBatch: handlers.add_batch,
    # commands.ChangeBatchQuantity: handlers.change_batch_quantity,
}


class MessageBus:
    def __init__(
        self,
        uow: AbstractUnitOfWork,
        event_handlers: dict[Type[events.Event], list[Callable]],
        command_handlers: dict[Type[commands.Command], Callable],
    ):
        self._uow = uow
        self._event_handlers = event_handlers
        self._command_handlers = command_handlers

    async def handle(self, message):
        queue = [message]
        results = []

        while queue:
            message = queue.pop(0)
            # print(message)

            if isinstance(message, events.Event):
                await self.handle_event(queue, message)
                queue.extend(self._uow.collect_new_messages())
            elif isinstance(message, commands.Command):
                results.append(await self.handle_command(message))
            else:
                raise Exception(f"{message} was not an Event or Command")

        return results

    async def handle_event(self, event):
        for handler in self._event_handlers[type(event)]:
            try:
                logger.debug(
                    "handling event %s with handler %s", event, handler
                )
                await handler(event, self._uow)

            except Exception:
                logger.exception("Exception handling event %s", event)
                continue

    async def handle_command(self, command):
        logger.debug("handling command %s", command)

        try:
            handler = self._command_handlers[type(command)]
            return await handler(command, self._uow)

        except Exception as e:
            logger.exception("Exception handling command %s", command)
            raise e


bus: MessageBus = None


def get_message_bus(
    uow: AbstractUnitOfWork = UnitOfWork(),
    event_handlers: dict[Type[events.Event], list[Callable]] = EVENT_HANDLERS,
    command_handlers: dict[
        Type[commands.Command], Callable
    ] = COMMAND_HANDLERS,
):
    global bus

    if not bus:
        bus = MessageBus(uow, event_handlers, command_handlers)
    return bus
