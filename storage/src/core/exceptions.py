class ApplicationException(Exception):
    pass


class BadRequest(ApplicationException):
    pass


class AuthNoPermissionException(ApplicationException):
    pass


class CdnServerConnectionError(ApplicationException):
    pass


class CdnServerAlreadyExists(ApplicationException):
    pass


class CdnServerDoesNotExist(ApplicationException):
    pass


class FileDoesNotExist(ApplicationException):
    pass


class FileAlreadyExists(ApplicationException):
    pass


class FileShareLinkDoesNotExist(ApplicationException):
    pass


class BadS3Event(ApplicationException):
    pass


class BadServiceEvent(ApplicationException):
    pass


class PublishMessageError(ApplicationException):
    pass


class DownloadFileError(ApplicationException):
    pass


class UploadFileError(ApplicationException):
    pass


class FileNotFoundInTempStorage(ApplicationException):
    pass


class RemoveFileError(ApplicationException):
    pass
