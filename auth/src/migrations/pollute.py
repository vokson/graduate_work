import asyncio
import logging
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))

sys.path.append(BASE_DIR)

from src.domain import commands
from src.service.messagebus import get_message_bus

logger = logging.getLogger(__name__)


async def main():
    bus = await get_message_bus(["db"])

    await bus.handle(
        commands.CreateUser(  # noqa
            username="admin",
            password="qwe123",
            email="admin@mail.ru",
            first_name="John",
            last_name="Doe",
            is_superuser=True,
            permissions=[
                "can_view_file",
                "can_rename_file",
                "can_upload_file",
                "can_download_file",
                "can_delete_file",
                "can_view_cdnserver",
                "can_change_cdnserver",
                "can_add_cdnserver",
                "can_delete_cdnserver",
                "can_view_filesharelink",
                "can_add_filesharelink",
                "can_delete_filesharelink",
            ],
        ),
    )

    await bus.handle(
        commands.CreateUser(  # noqa
            username="user",
            password="qwe123",
            email="user@mail.ru",
            first_name="Vasya",
            last_name="Pupkin",
            is_superuser=False,
            permissions=[
                "can_view_file",
                "can_rename_file",
                "can_upload_file",
                "can_download_file",
                "can_delete_file",
                "can_view_cdnserver",
                "can_view_filesharelink",
                "can_add_filesharelink",
                "can_delete_filesharelink",
            ],
        ),
    )


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(main())

    except KeyboardInterrupt:
        pass
