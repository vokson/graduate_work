async def required_permissions(
    required_permissions: list[str],
    is_access_token: bool = True,
):
    """Проверка требуемых разрешений"""

    def func_wrapper(func):
        @wraps(func)
        def inner(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                raise exceptions.AuthTokenMissedException

            parts = auth_header.split()

            if len(parts) != 2 or parts[0] != "Bearer":
                raise exceptions.AuthTokenMissedException

            encoded_token = parts[1]

            try:
                payload = jwt.decode(
                    encoded_token, settings.secret_key, [settings.token.algo]
                )

            except (
                jwt.exceptions.InvalidSignatureError,
                jwt.exceptions.DecodeError,
            ):
                raise exceptions.AuthTokenWithWrongSignatureException

            except jwt.exceptions.ExpiredSignatureError:
                raise exceptions.AuthTokenOutdatedException

            if cache.get(encoded_token):
                raise exceptions.AuthTokenOutdatedException

            token_permissions = payload.get("permissions")
            user_id = payload.get("user_id")
            token_type = payload.get("token_type")
            is_superuser = payload.get("is_superuser")

            if (
                token_permissions is None
                or user_id is None
                or is_superuser is None
                or token_type is None
                or (token_type == "access") != is_access_token  # noqa: S105
            ):
                raise exceptions.AuthTokenWrongPayloadException

            if (
                not is_superuser
                and len(set(required_permissions) - set(token_permissions)) > 0
            ):
                raise exceptions.NoPermissionException

            additional_kwargs = {
                "_user_id": user_id,
                "_is_superuser": is_superuser,
                "_token_permissions": token_permissions,
            }

            if token_type == "refresh":  # noqa: S105
                additional_kwargs.update({"_token": encoded_token})

            return func(*args, **kwargs, **additional_kwargs)

        return inner

    return func_wrapper