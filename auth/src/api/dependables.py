from fastapi import Header
from src.api.transformers import transform_command_result
from src.domain import commands
from src.service.messagebus import get_message_bus


def required_permissions_dependable(
    permissions: list[str], is_access_token: bool = True
):
    async def inner(
        authorization: str = Header(),
    ):
        bus = await get_bus()()
        results = await bus.handle(
            commands.CheckRequiredPermissions(
                required_permissions=permissions,
                is_access_token=is_access_token,
                auth_header=authorization,
            )
        )

        return transform_command_result(results)

    return inner


def get_bus():
    async def inner():
        return await get_message_bus(["db", "cache"])

    return inner
