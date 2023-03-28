class ApplicationException(Exception):
    pass


class BadRequest(ApplicationException):
    pass


class UserDoesNotExists(ApplicationException):
    pass


class UserAlreadyExists(ApplicationException):
    pass


class WrongCredentials(ApplicationException):
    pass
