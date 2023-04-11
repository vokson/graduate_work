import asyncio
import functools
from functools import wraps

from fastapi import HTTPException, Request, status
from src.adapters.http import http_session
from src.api.middlewares import get_request_var
from src.core.config import settings


# async def get_request(request: Request):
#     return request


def auth(permissions: list[str], timeout: int = 1):
    """Проверка разрешений через сервис авторизации"""

    def inner(func):
        @functools.wraps(func)
        async def wrapper(
            *args,
            **kwargs,
        ):
            request = get_request_var()

            auth_header = request.headers.get("Authorization")
            if not auth_header and permissions:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Auth.Error.TokenMissed",
                )

            if not auth_header:
                return await func(*args, **kwargs)

            url = (
                f"http://{settings.auth.host}:{settings.auth.port}"
                "/users/api/v1/auth/token/verify/"
            )
            data = {"permissions": permissions}
            session = http_session.client(timeout=timeout)

            try:
                headers = {
                    "Authorization": auth_header,
                }
                async with session.post(
                    url,
                    json=data,
                    headers=headers,
                ) as resp:
                    if resp.status != status.HTTP_200_OK:
                        json_data = await resp.json()
                        error = json_data["error"]
                        raise HTTPException(
                            status_code=resp.status, detail=error
                        )

                    return await func(*args, **kwargs)

            except asyncio.TimeoutError:
                raise HTTPException(
                    status_code=503, detail="Auth.Error.ServerUnavailable"
                )

        return wrapper

    return inner
