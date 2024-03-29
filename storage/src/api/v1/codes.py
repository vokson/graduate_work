from src.domain import command_results

COMMAND_RESULTS_RESPONSE_CODES = {
    command_results.DatabaseError: (400, "Database.Error"),
    command_results.UniqueViolationDatabaseError: (
        400,
        "Database.Error.UniqueViolation",
    ),
    command_results.AuthNoPermissionException: (
        403,
        "Auth.Error.NoPermission",
    ),
    command_results.FileDoesNotExist: (400, "File.DoesNotExist"),
    command_results.FileAlreadyExists: (400, "File.AlreadyExists"),
    command_results.FileShareLinkDoesNotExist: (
        400,
        "FileShareLink.DoesNotExist",
    ),
    command_results.CdnServerConnectionError: (
        400,
        "CdnServer.ConnectionError",
    ),
    command_results.CdnServerAlreadyExists: (400, "CdnServer.AlreadyExists"),
    command_results.CdnServerDoesNotExist: (400, "CdnServer.DoesNotExist"),
}


def get_response_json(error_codes: list[str]) -> dict:
    return {
        "content": {
            "application/json": {
                "schema": {
                    "title": "Error",
                    "required": ["error"],
                    "type": "object",
                    "properties": {
                        "error": {"type": "string", "enum": error_codes},
                        "detail": {
                            "title": "Detail",
                            "type": "string",
                        },
                    },
                },
            },
        },
    }


def collect_reponses():
    result = {}
    for status_code, error in COMMAND_RESULTS_RESPONSE_CODES.values():
        if status_code not in result:
            result[status_code] = []

        if error not in result[status_code]:
            result[status_code].append(error)

    return {
        status_code: get_response_json(error_codes)
        for status_code, error_codes in result.items()
    }
