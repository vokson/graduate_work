from fastapi import HTTPException

from src.api.v1.codes import COMMAND_RESULTS_RESPONSE_CODES


def transform_command_result(results):
    first_command_result = results.first_result

    if results.is_first_result_positive:
        return first_command_result.data

    if results.is_first_result_negative:
        code, detail = COMMAND_RESULTS_RESPONSE_CODES[
            first_command_result.__class__
        ]
        raise HTTPException(status_code=code, detail=detail)

    raise Exception(
        "Transform command result function has received "
        f"{first_command_result} not even CommandResult",
    )
