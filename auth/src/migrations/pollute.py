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
bus = get_message_bus()


async def main():
    await bus.handle(
        commands.CreateUser(
            username="admin",
            password="admin",
            email="admin@mail.ru",
            first_name="John",
            last_name="Doe",
            permissions=["can_upload_file", "can_download_file"],
        )
    )


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())

    except KeyboardInterrupt:
        pass
