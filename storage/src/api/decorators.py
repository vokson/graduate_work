import asyncio
import functools
from functools import wraps

from fastapi import Request, HTTPException, status

from src.core.config import settings
from src.adapters.http import http_session
from src.api.middlewares import get_request_var


# async def get_request(request: Request):
#     return request


def auth(permissions: list[str], timeout: int = 1):
    """Проверка разрешений через сервис авторизации"""

    def inner(func):
        @functools.wraps(func)
        async def wrapper(
            *args,
            # response: Response,
            **kwargs,
        ):
            request = get_request_var()

            auth_header = request.headers.get("Authorization")
            if not auth_header:
                raise HTTPException(status_code=status.HTTP_401_UNATHORIZED, detail="Auth.Error.TokenMissed")


            url = (
                f"http://{settings.auth.host}:{settings.auth.port}"
                "/users/api/v1/auth/token/verify/"
            )
            data = {"permissions": permissions}
            session = http_session.client(timeout=timeout)

            try:
                headers = {
                    "Authorization": auth_header,
                    # "X-Request-Id": request.headers.get("X-Request-Id"),
                }
                async with session.post(
                    url,
                    json=data,
                    headers=headers,
                ) as resp:

                    if resp.status != status.HTTP_200_OK:
                        json_data = await resp.json()
                        error = json_data['error']
                        raise HTTPException(status_code=resp.status, detail=error)

                    return await func(*args, **kwargs)

            except asyncio.TimeoutError:
                raise HTTPException(status_code=503, detail="Auth.Error.ServerUnavailable")

        return wrapper

    return inner