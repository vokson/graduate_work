import asyncio
import os
import sys


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.append(BASE_DIR)

from src.domain import commands
from src.service.messagebus import get_message_bus


async def main():
    bus = get_message_bus(["db", "s3"])
    # bus = get_message_bus(["db", "publisher"])
    print('HERE')
    result = await bus.handle(commands.CollectCreatedEventsFromStorage(name='s3_1'))
    print('HERE')
    print(result)

    # async with get_db(**admin_panel_db_dsl) as db:
    #     rabbit_connection = RabbitPublisher(rabbitmq_url, EXCHANGE)

    #     scheduler = Scheduler(
    #         db, rabbit_connection.push_message, chunk_size=10,
    #     )

    #     exchange_manager = RabbitManager(db)
    #     exchange_manager.register_exchange_handler(
    #         EXCHANGE, rabbit_connection.set_interval,
    #     )

    #     await asyncio.gather(
    #         scheduler.run(), rabbit_connection.run(), exchange_manager.run(),
    #     )


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())
        loop.run_forever()
    except KeyboardInterrupt:
        pass
