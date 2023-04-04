class Event {}

class ApiError extends Event {
  constructor(code) {
    super();
    this.code = code;
  }
}

// class AccessPagePermissionCheckFail extends Event {}
class UserLoginSuccess extends Event {}
class AccessTokenOutdated extends Event {}
class RefreshTokenOutdated extends Event {}
class UserLogoutSuccess extends Event {}
// class UserLoginFail extends Event {}
// class AuthTokenFail extends Event {}

// class UsersGetSuccess extends Event {}
// class UsersUpdateSuccess extends Event {}
// class UsersDeleteSuccess extends Event {}

// class UserReplacementAddSuccess extends Event {}
// class UserReplacementDeleteSuccess extends Event {}

// class OnBehalfUserChangeSuccess extends Event {}
// class OnBehalfUserDeleteSuccess extends Event {}

// class FoldersAddSuccess extends Event {}
// class FoldersUpdateSuccess extends Event {}
// class FoldersDeleteSuccess extends Event {}

class UploadFileError extends Event {
  constructor(filename) {
    super();
    this.filename = filename;
  }
}

class UploadEmptyFileError extends UploadFileError {}
class UploadFileTooBigError extends UploadFileError {}
// class UploadFileWrongExtensionError extends UploadFileError {}
// class UploadFileWrongFilenameError extends UploadFileError {}

class UploadFileSuccess extends Event {}

// class SaveManyDocumentsSuccess extends Event {}
// class DeleteManyDocumentsSuccess extends Event {}

// class DocumentAttributesChanged extends Event {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class DuplicateDocumentToUsergroupSuccess extends Event {}
// class DuplicateManyDocumentsToUsergroupSuccess extends Event {}

// class DocumentFilesAreUploading extends Event {}

// class FileUpdatedSuccess extends Event {}
class DeleteFileSuccess extends Event {}

// class FileAttachedToDocument extends Event {
//   constructor(folder_id, usergroup_id, document_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//   }
// }

// class FileDetachedFromDocument extends Event {
//   constructor(folder_id, usergroup_id, document_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//   }
// }

// class DocumentButtonPushed extends Event {}

// class FilesAllocated extends Event {}

// class AddRoleSuccess extends Event {}
// class DeleteRoleSuccess extends Event {}

// class AddUserFolderSettingsSuccess extends Event {}
// class UpdateUserFolderSettingsSuccess extends Event {}
// class DeleteUserFolderSettingsSuccess extends Event {}

// class SetUserSearchSchemaSuccess extends Event {}

// class AddPermissionSuccess extends Event {}
// class DeletePermissionSuccess extends Event {}

// class DocumentLinkCopied extends Event {}
// class FileLinkCopied extends Event {}

// class AddUserGroupSuccess extends Event {}
// class UpdateUserGroupSuccess extends Event {}
// class DeleteUserGroupSuccess extends Event {}
// class UserGroupHasNotBeenAssigned extends Event {}

// class DocumentAddedToCartSuccess extends Event {}
// class DocumentRemovedFromCartSuccess extends Event {}
// class ManyDocumentsAddedToCartSuccess extends Event {}

// class AddFlowSuccess extends Event {}
// class UpdateFlowSuccess extends Event {}
// class DeleteFlowSuccess extends Event {}
// class RestartFlowItemSuccess extends Event {}

// class SelfTestingRepliedSuccess extends Event {}
// class SelfTestingRepliedFail extends Event {}

// class DocumentApprovalAddedSuccess extends Event {}
// class DocumentApprovalUpdatedSuccess extends Event {}
// class DocumentApprovalDeletedSuccess extends Event {}
// class DocumentApprovalDelegatedSuccess extends Event {}

// class EmptyApprovalFlowSaved extends Event {}
// class ApprovalFlowStarted extends Event {}
// class ApprovalFlowStopped extends Event {}
// class ApprovalFlowUploadError extends Event {}

// class ServerSettingUpdatedSuccess extends Event {}

// class MailBoxAddedSuccess extends Event {}
// class MailBoxUpdatedSuccess extends Event {}
// class MailBoxDeletedSuccess extends Event {}

// class MailChannelAddedSuccess extends Event {}
// class MailChannelUpdatedSuccess extends Event {}
// class MailChannelDeletedSuccess extends Event {}
// class MailChannelFetchedSuccess extends Event {}

// class MailMessageDeletedSuccess extends Event {}

// class CounterAddedSuccess extends Event {}
// class CounterUpdatedSuccess extends Event {}
// class CounterDeletedSuccess extends Event {}

export {
  Event,
  ApiError,

  // LOGIN
  UserLoginSuccess,
  AccessTokenOutdated,
  RefreshTokenOutdated,
  UserLogoutSuccess,
  // UserLoginFail,
  // AuthTokenFail,

  // // PERMISSION
  // AccessPagePermissionCheckFail,
  // AddPermissionSuccess,
  // DeletePermissionSuccess,

  // // USER
  // UsersGetSuccess,
  // UsersUpdateSuccess,
  // UsersDeleteSuccess,
  // UserReplacementAddSuccess,
  // UserReplacementDeleteSuccess,
  // OnBehalfUserChangeSuccess,
  // OnBehalfUserDeleteSuccess,

  // // FOLDER
  // FoldersAddSuccess,
  // FoldersUpdateSuccess,
  // FoldersDeleteSuccess,

  // FILE
  UploadFileError,
  UploadEmptyFileError,
  UploadFileTooBigError,
  // UploadFileWrongFilenameError,
  // UploadFileWrongExtensionError,
  UploadFileSuccess,
  // DocumentFilesAreUploading,
  // FileUpdatedSuccess,
  DeleteFileSuccess,
  // FileAttachedToDocument,
  // FileDetachedFromDocument,
  // FilesAllocated,
  // FileLinkCopied,

  // // DOCUMENT
  // SaveManyDocumentsSuccess,
  // DeleteManyDocumentsSuccess,
  // DocumentAttributesChanged,
  // DuplicateDocumentToUsergroupSuccess,
  // DuplicateManyDocumentsToUsergroupSuccess,
  // DocumentLinkCopied,
  // DocumentButtonPushed,
  
  // // DOCUMENT APPROVAL
  // DocumentApprovalAddedSuccess,
  // DocumentApprovalUpdatedSuccess,
  // DocumentApprovalDeletedSuccess,
  // DocumentApprovalDelegatedSuccess,

  // // DOCUMENT APPROVAL FLOW
  // EmptyApprovalFlowSaved,
  // ApprovalFlowStarted,
  // ApprovalFlowStopped,
  // ApprovalFlowUploadError,

  // // ROLE
  // AddRoleSuccess,
  // DeleteRoleSuccess,

  // // USER FOLDER SETTINGS
  // AddUserFolderSettingsSuccess,
  // UpdateUserFolderSettingsSuccess,
  // DeleteUserFolderSettingsSuccess,

  // // USER SEARCH SCHEMA
  // SetUserSearchSchemaSuccess,

  // // USER GROUP
  // AddUserGroupSuccess,
  // UpdateUserGroupSuccess,
  // DeleteUserGroupSuccess,
  // UserGroupHasNotBeenAssigned,


  // // CART
  // DocumentAddedToCartSuccess,
  // DocumentRemovedFromCartSuccess,
  // ManyDocumentsAddedToCartSuccess,

  // // FLOW
  // AddFlowSuccess,
  // UpdateFlowSuccess,
  // DeleteFlowSuccess,

  // // FLOW ITEM
  // RestartFlowItemSuccess,

  // // SELF TESTING
  // SelfTestingRepliedSuccess,
  // SelfTestingRepliedFail,

  // // SERVER SETTINGS
  // ServerSettingUpdatedSuccess,
  
  // // MAILBOXES
  // MailBoxAddedSuccess,
  // MailBoxUpdatedSuccess,
  // MailBoxDeletedSuccess,

  // // MAIL CHANNELS
  // MailChannelAddedSuccess,
  // MailChannelUpdatedSuccess,
  // MailChannelDeletedSuccess,
  // MailChannelFetchedSuccess,

  // // MAIL MESSAGES
  // MailMessageDeletedSuccess,

  // // COUNTERS
  // CounterAddedSuccess,
  // CounterUpdatedSuccess,
  // CounterDeletedSuccess,
};
