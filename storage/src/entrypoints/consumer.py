import asyncio
import os
import sys
import logging
import time
from contextlib import asynccontextmanager


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.append(BASE_DIR)

from src.domain import commands
from src.service.messagebus import get_message_bus, MessageBus
from src.tools.delay import DelayCalculator
# from src.core.operator import AbstractAsyncOperator
from src.adapters.broker import RabbitConsumer
from src.adapters.cache import init_cache, close_cache
# from src.adapters.db import get_db_conn, release_db_conn
# from src.adapters.repositories.cdn_server import CdnServerRepository
# from src.adapters.s3 import init_s3_pool, AbstractS3Storage
from src.core.config import settings, rabbitmq_url, cache_dsl
# from aiostream import stream


logger = logging.getLogger(__name__)


# def get_db_connection():
#     return get_db_conn(**db_dsl)


# def get_s3_pool():
#     return init_s3_pool(settings.s3.bucket, get_s3_dsl)

# async def listen_storage(storage: AbstractS3Storage):
#     async for x in storage.get_created_events():
#         logger.info(f'Created file "{x}" on server {storage}')
 

# async def do(listeners):
#     asyncio.gather(*listeners)

# class EventCollector(AbstractAsyncOperator):
#     def __init__(self):
#         super().__init__()
#         self._bus = get_message_bus(["db", "s3", "publisher"])
#         self._cmd = commands.CollectStorageEvents()

#     async def _do(self):
#         results = await self._bus.handle(self._cmd)
#         print(results)
#         if results.is_first_result_positive:
#             print('**************')
#             result = results.first_result
#             print(result)
#             if result.data['done'] > 0:
#                 self._delay_calculator.done()

@asynccontextmanager
async def get_cache():
    cache = await init_cache(**cache_dsl)
    yield cache
    await close_cache()

def get_handler(bus: MessageBus):
    async def inner(app_id, message_id, routing_key, body):
        cmd = commands.HandleS3Event(routing_key=routing_key ,body=body)
        results = await bus.handle(cmd)
        return results.are_all_results_positive

    return inner


async def main():
    async with get_cache() as cache_conn:
        bus = get_message_bus(["db"])

        rabbit_consumer = RabbitConsumer(
                    rabbitmq_url,
                    settings.rabbitmq.exchange,
                    settings.rabbitmq.queues.listen_s3_events,
                    get_handler(bus),
                    routing_key="S3.#.EVENT",
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