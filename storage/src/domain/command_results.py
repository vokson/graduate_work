from src.domain import commands


class CommandResult:
    def __init__(self, data):
        self._data = data

    @property
    def data(self):
        return self._data

    def __repr__(self) -> str:
        return str(self.data)


class PositiveCommandResult(CommandResult):
    pass


class NegativeCommandResult(CommandResult):
    pass


class CommandResults:
    def __init__(self):
        self._results = []

    def add(self, cmd, result):
        self._results.append((cmd, result))

    def get_result(self, idx):
        _, result = self._results[idx]
        return result

    @property
    def first_result(self):
        return self.get_result(0)

    @property
    def is_first_result_positive(self):
        return isinstance(self.first_result, PositiveCommandResult)

    @property
    def is_first_result_negative(self):
        print(self._results)
        return not isinstance(self.first_result, PositiveCommandResult)

    @property
    def are_all_results_positive(self):
        for _, x in self._results:
            if not isinstance(x, PositiveCommandResult):
                return False

        return True


class DatabaseError(NegativeCommandResult):
    pass


class UniqueViolationDatabaseError(NegativeCommandResult):
    pass


class AuthNoPermissionException(NegativeCommandResult):
    pass


# class ValidationError(NegativeCommandResult):
#     pass


# class AuthTokenMissedException(NegativeCommandResult):
#     pass


# class AuthTokenWithWrongSignatureException(NegativeCommandResult):
#     pass


# class AuthTokenOutdatedException(NegativeCommandResult):
#     pass


# class AuthTokenWrongPayloadException(NegativeCommandResult):
#     pass


# class AuthNoPermissionException(NegativeCommandResult):
#     pass


# class UserDoesNotExist(NegativeCommandResult):
#     pass


class CdnServerAlreadyExists(NegativeCommandResult):
    pass


class FileDoesNotExist(NegativeCommandResult):
    pass


class FileAlreadyExists(NegativeCommandResult):
    pass


class FileShareLinkDoesNotExist(NegativeCommandResult):
    pass


class BadS3Event(NegativeCommandResult):
    pass


class BadServiceEvent(NegativeCommandResult):
    pass


class PublishMessageError(NegativeCommandResult):
    pass


class DownloadFileError(NegativeCommandResult):
    pass


class UploadFileError(NegativeCommandResult):
    pass


class FileNotFoundInTempStorage(NegativeCommandResult):
    pass


class RemoveFileError(NegativeCommandResult):
    pass

class CdnServerConnectionError(NegativeCommandResult):
    pass
