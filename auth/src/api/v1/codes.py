from src.domain import command_results


# from . import exceptions

COMMAND_RESULTS_RESPONSE_CODES = {
    command_results.DatabaseError: "Database.Error",
    command_results.UniqueViolationDatabaseError: "Database.Error.UniqueViolation",
    command_results.ValidationError: "Request.Error.Validation",
    command_results.UserAlreadyExists: "User.AlreadyExists",
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

# API_EXCEPTIONS_RESPONSE_CODES = {
#       PostgresError: "Database.Error"
#     exceptions.AuthTokenFail: "Auth.Token.Fail",
#     exceptions.AuthTokenBlocked: "Auth.Token.Blocked",
#     exceptions.AuthTokenNotAllowed: "Auth.Token.NotAllowed",
#     exceptions.RequestBodyNotJson: "Request.Body.NotJson",
#     exceptions.ParameterBodyWrong: "Parameter.Body.Wrong",
#     exceptions.ParameterPathWrong: "Parameter.Path.Wrong",
#     exceptions.ParameterQueryWrong: "Parameter.Query.Wrong",
# }
