# from __future__ import annotations
import logging
from typing import Callable, Type 
from src.domain import commands, events
from src.service import handlers
from src.service.uow import AbstractUnitOfWork

# if TYPE_CHECKING:
#     from . import unit_of_work

logger = logging.getLogger(__name__)

Message = commnads.Command | events.Event


EVENT_HANDLERS = {
    # events.Allocated: [handlers.publish_allocated_event],
    # events.OutOfStock: [handlers.send_out_of_stock_notification],
} 

COMMAND_HANDLERS = {
    commands.CreateUser: handlers.users.create,
    # commands.Allocate: handlers.allocate,
    # commands.CreateBatch: handlers.add_batch,
    # commands.ChangeBatchQuantity: handlers.change_batch_quantity,
} 

class MessageBus:
    def __init__(self,
        uow: AbstractUnitOfWork,
        event_handlers: dict[Type[events.Event], List[Callable]]=EVENT_HANDLERS,
        command_handlers: dict[Type[commands.Command], Callable]=COMMAND_HANDLERS
    ):
        self._uow = uow
        self._event_handlers = event_handlers
        self._command_handlers = command_handlers

    def handle(self, message):
        queue = [message]
        results = command_results.CommandResults()

        try:
            while queue:
                message = queue.pop(0)
                # print(message)

                if isinstance(message, events.Event):
                    self.handle_event(queue, message)
                elif isinstance(message, commands.Command):
                    results.add(message, self.handle_command(queue, message))
                else:
                    raise Exception(f"{message} was not an Event or Command")

        except Exception as e:
            results.add(message, e)

        return results

    def handle_event(self, queue, event):
        for handler in self._event_handlers[type(event)]:
            try:
                logger.debug("handling event %s with handler %s", event, handler)
                handler(event, self._uow)
                queue.extend(self._uow.collect_new_messages())

            except Exception:
                logger.exception("Exception handling event %s", event)
                continue

    def handle_command(self, queue, command):
        logger.debug("handling command %s", command)

        try:
            handler = self._command_handlers[type(command)]
            result = handler(command, self._uow)
            return result

        except Exception as e:
            logger.exception("Exception handling command %s", command)
            raise e