from src.domain import command_results


# from . import exceptions

COMMAND_RESULTS_RESPONSE_CODES = {
    command_results.DatabaseError: (400, "Database.Error"),
    command_results.UniqueViolationDatabaseError: (
        400,
        "Database.Error.UniqueViolation",
    ),
    command_results.ValidationError: (400, "Request.Error.Validation"),
    command_results.UserDoesNotExist: (400, "User.DoesNotExist"),
    command_results.UserAlreadyExists: (400, "User.AlreadyExists"),
    command_results.WrongCredentials: (401, "Login.Error.Credentials"),
    command_results.AuthTokenMissedException: (401, "Auth.Error.TokenMissed"),
    command_results.AuthTokenWithWrongSignatureException: (
        401,
        "Auth.Error.TokenWithWrongSignature",
    ),
    command_results.AuthTokenOutdatedException: (
        401,
        "Auth.Error.TokenOutdated",
    ),
    command_results.AuthTokenWrongPayloadException: (
        401,
        "Auth.Error.WrongTokenPayload",
    ),
    command_results.AuthNoPermissionException: (403, "Auth.Error.NoPermission")
    # command_results.DatabaseErrorIntegrity: "Database.Error.Integrity",
    # command_results.DatabaseErrorProtected: "Database.Error.Protected",
    # command_results.DatabaseErrorValidation: "Database.Error.Validation",
    # command_results.AuthCredentialsFail: "Auth.Credentials.Fail",
    # command_results.AuthCredentialsBlocked: "Auth.Credentials.Blocked",
    # command_results.WrongBehalfOnUser: "User.Error.WrongOnBehalf",
    # command_results.ParameterBodyWrong: "Parameter.Body.Wrong",
    # command_results.ParameterQueryWrong: "Parameter.Query.Wrong",
    # command_results.StorageNotAvailable: "Storage.Error.NotAvailable",
    # command_results.SettingNotAvailable: "Setting.Error.NotAvailable",
    # command_results.DocumentBlocked: "Document.Error.Blocked",
    # command_results.DocumentApprovalAlreadyDone: "DocumentApproval.Error.AlreadyDone",
    # command_results.DocumentApprovalCanNotBeDeleted: "DocumentApproval.Error.CanNotBeDeleted",
    # command_results.DocumentApprovalCanNotDelegate: "DocumentApproval.Error.CanNotDelegate",
    # command_results.DocumentApprovalAlreadyDelegated: "DocumentApproval.Error.AlreadyDelegated",
    # command_results.DocumentApprovalHasBeenDelegatedWithReturn: "DocumentApproval.Error.HasBeenDelegatedWithReturn",
    # command_results.DocumentApprovalFileCanNotBeDeleted: "DocumentApprovalFile.Error.CanNotBeDeleted",
    # command_results.DocumentApprovalFlowBlocked: "DocumentApprovalFlow.Error.Blocked",
    # command_results.DocumentApprovalFlowDoesNotExist: "DocumentApprovalFlow.Error.DoesNotExist",
    # command_results.DocumentApprovalFlowAlreadyStopped: "DocumentApprovalFlow.Error.AlreadyStopped",
    # command_results.DocumentApprovalFlowAlreadyStarted: "DocumentApprovalFlow.Error.AlreadyStarted",
    # command_results.FileBlockedAttachedToDocument: "File.Blocked.AttachedToDocument",
    # command_results.FileZeroSizeUploaded: "File.Uploaded.ZeroSize",
    # command_results.LargeZipFile: "File.Error.TooLarge",
    # command_results.MailReceiverLoginError: "MailReceiver.Error.Login",
    # command_results.MailReceiverListError: "MailReceiver.Error.List",
    # command_results.MailReceiverFetchError: "MailReceiver.Error.Fetch",
    # command_results.MailParserMessageFromBytesError: "MailParser.Error.WrongBytes",
    # command_results.MailParserMessageHeadersError: "MailParser.Error.Headers",
    # command_results.MailParserMessageTextBodyError: "MailParser.Error.TextBody",
    # command_results.MailParserMessageHtmlBodyError: "MailParser.Error.HtmlBody",
    # command_results.MailParserMessageAttachmentError: "MailParser.Error.Attachment",
    # command_results.MailParserMessageCidImageError: "MailParser.Error.CidImage",
    # command_results.MailParserMessageConvertHtmlBodyError: "MailParser.Error.ConvertHtmlBody",
    # command_results.MailChannelSettingsError: "MailChannel.Error.Settings",
    # command_results.MailMessageBodyNotFound: "MailMessage.Body.NotFound",
    # command_results.TransmittalCoverSheetError: "Transmittal.Error.CoverSheet",
    # command_results.PdfOperationError: "Pdf.Error.Operation",
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
                }
            }
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
