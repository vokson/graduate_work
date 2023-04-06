import asyncio
import logging
import os
import sys
from uuid import UUID


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))

sys.path.append(BASE_DIR)

from src.domain import commands
from src.service.messagebus import get_message_bus


logger = logging.getLogger(__name__)
bus = get_message_bus(['db'])


async def main():
    cdn_servers = [
        ("s3_1", "10.95.27.163", 9001, "New York", 40.730610, -73.935242),
        ("s3_2", "10.95.27.163", 9002, "Vladivostok", 43.1056200, 131.8735300),
        ("s3_3", "10.95.27.163", 9003, "Cape Town", -33.918861, 18.423300),
    ]

    for name, host, port, location, latitude, longitude in cdn_servers:
        await bus.handle(
            commands.CreateCdnServer(
                name=name,
                host=host,
                port=port,
                location=location,
                latitude=latitude,
                longitude=longitude,
            )
        )

    # files = [
    #     ('file_1', 111111, ['s3_1']),
    #     ('file_2', 222222, ['s3_2']),
    #     ('file_3', 333333, ['s3_3']),
    #     ('file_4', 444444, ['s3_1', 's3_2', 's3_3']),
    # ]

    # for name, size, servers in files:
    #     await bus.handle(
    #         commands.CreateFile(
    #             name=name,
    #             size=size,
    #             servers=servers,
    #         )
    #     )


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())

    except KeyboardInterrupt:
        pass
