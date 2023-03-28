class ApplicationException(Exception):
    pass

class BadRequest(ApplicationException):
    pass

class UserAlreadyExists(ApplicationException):
    pass
