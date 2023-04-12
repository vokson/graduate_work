import logging
from typing import Callable, Type

from src.domain import command_results, commands, events
from src.service.handlers import COMMAND_HANDLERS, EVENT_HANDLERS, RESULTS
from src.service.uow import AbstractUnitOfWork, UnitOfWork

logger = logging.getLogger(__name__)

Message = commands.Command | events.Event


from sys import exc_info
from traceback import format_exception


def print_exception():
    etype, value, tb = exc_info()
    info, error = format_exception(etype, value, tb)[-2:]
    logger.info(f"EXCEPTION IN:\n{info}\n{error}")


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
        results = command_results.CommandResults()

        try:
            while queue:
                message = queue.pop(0)

                if isinstance(message, events.Event):
                    await self.handle_event(message)
                    queue.extend(self._uow.collect_new_messages())

                elif isinstance(message, commands.Command):
                    results.add(message, await self.handle_command(message))
                    queue.extend(self._uow.collect_new_messages())

                else:
                    raise Exception(f"{message} was not an Event or Command")

        except Exception as e:
            print_exception()
            results.add(message, e)

        return results

    async def handle_event(self, event):
        for handler in self._event_handlers[type(event)]:
            try:
                logger.debug(f"Handling event {event} with handler {handler}")
                await handler(event, self._uow)

            except Exception:
                logger.error(f"Exception handling event {event}")
                continue

    async def handle_command(self, command):
        logger.debug(f"Handling command {command}")

        try:
            handler = self._command_handlers[type(command)]
            return await handler(command, self._uow)

        except Exception as e:
            logger.error(f"Exception handling command {command}")
            logger.info(e)

            negative_result = self._handle_exception(e)
            if not negative_result:
                raise e

            return negative_result

    def _handle_exception(self, error):
        cls = RESULTS.get(error.__class__)

        if not cls:
            for parent_class in RESULTS.keys():
                if isinstance(error, parent_class):
                    cls = RESULTS[parent_class]
                    break

        if cls:
            return cls(str(error))


async def get_message_bus(
    bootstrap: list[str],
    uow: AbstractUnitOfWork = None,
    event_handlers: dict[Type[events.Event], list[Callable]] = EVENT_HANDLERS,
    command_handlers: dict[
        Type[commands.Command],
        Callable,
    ] = COMMAND_HANDLERS,
):
    if not uow:
        uow = UnitOfWork(bootstrap)
        await uow.startup()

    bus = MessageBus(uow, event_handlers, command_handlers)
    return bus
