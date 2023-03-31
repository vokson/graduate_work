class ApplicationException(Exception):
    pass


class BadRequest(ApplicationException):
    pass


# class AuthTokenMissedException(ApplicationException):
#     pass


# class AuthTokenWithWrongSignatureException(ApplicationException):
#     pass


# class AuthTokenOutdatedException(ApplicationException):
#     pass


# class AuthTokenWrongPayloadException(ApplicationException):
#     pass


# class AuthNoPermissionException(ApplicationException):
#     pass


# class UserDoesNotExists(ApplicationException):
#     pass


class CdnServerAlreadyExists(ApplicationException):
    pass


# class WrongCredentials(ApplicationException):
#     pass
