import asyncio
import logging
import os
import sys
from contextlib import asynccontextmanager

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
)
sys.path.append(BASE_DIR)

from src.adapters.broker import RabbitConsumer
from src.adapters.cache import close_cache, init_cache
from src.core.config import cache_dsl, rabbitmq_url, settings
from src.domain import commands
from src.service.messagebus import MessageBus, get_message_bus

logger = logging.getLogger(__name__)


@asynccontextmanager
async def get_cache():
    cache = await init_cache(**cache_dsl)
    yield cache
    await close_cache()


def get_handler(bus: MessageBus):
    async def inner(app_id, message_id, routing_key, body):
        cmd = commands.HandleServiceEvent(routing_key=routing_key, body=body)
        results = await bus.handle(cmd)
        return results.are_all_results_positive

    return inner


async def main():
    async with get_cache() as cache_conn:
        bus = await get_message_bus(["db", "s3", "publisher"])

        rabbit_consumer = RabbitConsumer(
            rabbitmq_url,
            settings.rabbitmq.exchange,
            settings.rabbitmq.queues.file_operations,
            get_handler(bus),
            routing_key=f"{settings.app_name}.#",
            cache=cache_conn,
        )

        asyncio.gather(await rabbit_consumer.run())


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())
        loop.run_forever()
    except KeyboardInterrupt:
        pass
