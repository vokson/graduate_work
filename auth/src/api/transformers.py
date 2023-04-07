from fastapi import HTTPException, status
from src.api.v1.codes import COMMAND_RESULTS_RESPONSE_CODES
from src.domain.command_results import NegativeCommandResult


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
        f"Transform command result function has received {first_command_result} not even CommandResult"
    )


# def transform_file_result(results):
#     first_result = results.first_result

#     if isinstance(first_result, NegativeCommandResult):
#         return transform_command_result(results)

#     filename = first_result.data["original_name"]

#     if first_result.data.get("server_name"):
#         file = open(first_result.data["server_name"], "rb")
#     else:
#         file = first_result.data["bytes_io"]
#         file.seek(0)

#     response = FileResponse(
#         file,
#         as_attachment=True,
#         filename=filename,
#         headers={
#             "Access-Control-Expose-Headers": "*",
#         },
#     )
#     response["Content-Type"] = "application/octet-stream"
#     return response
