from src.api.transformers import transform_command_result
from src.domain import commands
from src.service.messagebus import get_message_bus

from fastapi import Header


bus = get_message_bus()


def required_permissions_dependable(
    permissions: list[str], is_access_token: bool = True
):
    async def inner(
        authorization: str = Header(),
    ):
        results = await bus.handle(
            commands.CheckRequiredPermissions(
                required_permissions=permissions,
                is_access_token=is_access_token,
                auth_header=authorization,
            )
        )

        return transform_command_result(results)

    return inner
