import asyncio
import logging
import os
import sys
from uuid import uuid4

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))

sys.path.append(BASE_DIR)

from src.domain import commands
from src.service.messagebus import get_message_bus

logger = logging.getLogger(__name__)


async def main():
    bus = await get_message_bus(["db"])

    cdn_servers = [
        (
            "s1_1",
            "51.250.10.146",
            9001,
            "Detroit",
            "USA",
            42.3314,
            -83.0458,
            True,
            False,
        ),
        (
            "s1_2",
            "51.250.10.146",
            9002,
            "New York",
            "USA",
            40.730610,
            -73.935242,
            True,
            True,
        ),
        (
            "s1_3",
            "51.250.10.146",
            9003,
            "Dallas",
            "USA",
            32.7831,
            -96.8067,
            True,
            True,
        ),
        (
            "s2_1",
            "51.250.10.146",
            9004,
            "Vladivostok",
            "Russia",
            43.1056200,
            131.8735300,
            True,
            True,
        ),
        (
            "s3_1",
            "51.250.10.146",
            9005,
            "Cape Town",
            "Africa",
            -33.918861,
            18.423300,
            True,
            True,
        ),
    ]

    for (
        name,
        host,
        port,
        location,
        zone,
        latitude,
        longitude,
        on,
        active,
    ) in cdn_servers:
        await bus.handle(
            commands.CreateCdnServer(
                user_id=uuid4(),
                name=name,
                host=host,
                port=port,
                location=location,
                zone=zone,
                latitude=latitude,
                longitude=longitude,
                is_on=on,
                is_active=active,
            ),
        )


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())

    except KeyboardInterrupt:
        pass
