class Command { }

class Notify extends Command {
  constructor(level, text) {
    super();
    this.level = level;
    this.text = text;
  }
}

class NotifyApiError extends Command {
  constructor(code) {
    super();
    this.code = code;
  }
}

class LoginWithCredentials extends Command {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
}

class Logout extends Command { }

class MyCredentials extends Command { }
class RefreshTokens extends Command { }
class GetCdnServers extends Command { }
class GetFiles extends Command { }
class GetFileServers extends Command {
  constructor(id) {
    super();
    this.id = id;
  }
}

class DeleteFile extends Command {
  constructor(id) {
    super();
    this.id = id;
  }
}

class DownloadFile extends Command {
  constructor(id) {
    super();
    this.id = id;
  }
}

// class LoginWithToken extends Command {}


// class GetInfo extends Command {}

// class GetUsers extends Command {}

// class SetUser extends Command {
//   constructor(
//     username,
//     is_active,
//     access_group_regex,
//     role,
//     role_inside_group,
//     role_outside_group
//   ) {
//     super();
//     this.username = username;
//     this.is_active = is_active;
//     this.access_group_regex = access_group_regex;
//     this.role = role;
//     this.role_inside_group = role_inside_group;
//     this.role_outside_group = role_outside_group;
//   }
// }

// class DeleteUser extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class GetUserReplacements extends Command {}

// class AddUserReplacement extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class DeleteUserReplacement extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class GetUserReplacementsOfUser extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class AddUserReplacementToUser extends Command {
//   constructor(username_to_be_replaced, replaced_with_username) {
//     super();
//     this.username_to_be_replaced = username_to_be_replaced;
//     this.replaced_with_username = replaced_with_username;
//   }
// }

// class DeleteUserReplacementFromUser extends Command {
//   constructor(username_to_be_replaced, replaced_with_username) {
//     super();
//     this.username_to_be_replaced = username_to_be_replaced;
//     this.replaced_with_username = replaced_with_username;
//   }
// }

// class GetOnBehalfUsers extends Command {}

// class SetOnBehalfUser extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class DeleteOnBehalfUser extends Command {
//   constructor(username) {
//     super();
//     this.username = username;
//   }
// }

// class GetFolders extends Command {}

// class AddFolder extends Command {
//   constructor(
//     name,
//     storage_path,
//     master_usergroup_slug,
//     access_group,
//     settings
//   ) {
//     super();
//     this.name = name;
//     this.storage_path = storage_path;
//     this.master_usergroup_slug = master_usergroup_slug;
//     this.access_group = access_group;
//     this.settings = settings;
//   }
// }

// class DeleteFolder extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class UpdateFolder extends Command {
//   constructor(
//     id,
//     name,
//     storage_path,
//     master_usergroup_slug,
//     access_group,
//     settings
//   ) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.storage_path = storage_path;
//     this.master_usergroup_slug = master_usergroup_slug;
//     this.access_group = access_group;
//     this.settings = settings;
//   }
// }

// class GetManyDocuments extends Command {
//   constructor(
//     folder_id,
//     usergroup_id,
//     query_obj,
//     offset,
//     limit,
//     sort_by,
//     sort_asc,
//     sort_rule
//   ) {
//     super();

//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.query = query_obj;

//     this.offset = offset;
//     this.limit = limit;

//     this.sort_by = sort_by;
//     this.sort_asc = sort_asc;
//     this.sort_rule = sort_rule;
//   }
// }

// class GetDocument extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class GetWaitingDocumentApprovals extends Command {}

// class UploadFileToFolder extends Command {
//   constructor(folder_id, usergroup_id, file_id, file) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.file_id = file_id;
//     // Здесь file это https://developer.mozilla.org/ru/docs/Web/API/File
//     this.file = file;
//   }
// }

// class DownloadFileFromFolder extends Command {
//   constructor(folder_id, usergroup_id, file_id, name, size, inline) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.file_id = file_id;
//     this.name = name;
//     this.size = size;
//     this.inline = inline;
//   }
// }

// class DownloadManyDocumentsFilesAsArchive extends Command {
//   constructor(folder_id, usergroup_id, document_ids, size) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_ids = document_ids;
//     this.size = size;
//   }
// }

// class DownloadDocumentFilesAsArchive extends Command {
//   constructor(folder_id, usergroup_id, document_id, size) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.size = size;
//   }
// }

// class GetFileInfo extends Command {
//   constructor(file_id) {
//     super();
//     this.file_id = file_id;
//   }
// }

// class DeleteFileFromFolder extends Command {
//   constructor(folder_id, usergroup_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.file_id = file_id;
//   }
// }

// class UpdateFileFromFolder extends Command {
//   constructor(folder_id, usergroup_id, file_id, filename) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.file_id = file_id;
//     this.name = filename;
//   }
// }

// class GetRoles extends Command {}

// class AddRole extends Command {
//   constructor(name) {
//     super();
//     this.name = name;
//   }
// }

// class DeleteRole extends Command {
//   constructor(name) {
//     super();
//     this.name = name;
//   }
// }

// class GetUserFolderSettings extends Command {}

// class AddUserFolderSettings extends Command {
//   constructor(folder_id, usergroup_slug, username, role, search_schema) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_slug = usergroup_slug;
//     this.username = username;
//     this.role = role;
//     this.search_schema = search_schema;
//   }
// }

// class UpdateUserFolderSettings extends Command {
//   constructor(id, folder_id, usergroup_slug, username, role, search_schema) {
//     super();
//     this.id = id;
//     this.folder_id = folder_id;
//     this.usergroup_slug = usergroup_slug;
//     this.username = username;
//     this.role = role;
//     this.search_schema = search_schema;
//   }
// }

// class DeleteUserFolderSettings extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetPermissions extends Command {}

// class AddPermission extends Command {
//   constructor(role, perm) {
//     super();
//     this.role = role;
//     this.perm = perm;
//   }
// }

// class DeletePermission extends Command {
//   constructor(role, perm) {
//     super();
//     this.role = role;
//     this.perm = perm;
//   }
// }

// class GetUserPermissions extends Command {}

// class GetUserPermissionsForFolder extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class GetUserSearchSchema extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class SetUserSearchSchema extends Command {
//   constructor(folder_id, usergroup_id, search_schema) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.search_schema = search_schema;
//   }
// }

// class DeleteUserSearchSchema extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class SetDocumentAttribute extends Command {
//   constructor(
//     folder_id,
//     usergroup_id,
//     document_id,
//     name,
//     value,
//     to_be_decoded
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.name = name;
//     this.value = value;
//     this.to_be_decoded = to_be_decoded;
//   }
// }

// class SaveDocumentsInFolder extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// // class SaveDocument extends Command {
// //   constructor(folder_id, document_id, data, files) {
// //     super();
// //     this.folder_id = folder_id;
// //     this.document_id = document_id;
// //     this.data = data;
// //     this.files = files;
// //   }
// // }

// class SaveManyDocuments extends Command {
//   constructor(folder_id, usergroup_id, docs) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.docs = docs;
//   }
// }

// class MarkDocumentAsDeleted extends Command {
//   constructor(folder_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.document_id = document_id;
//   }
// }

// class MarkDocumentAsNotDeleted extends Command {
//   constructor(folder_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.document_id = document_id;
//   }
// }

// // class DeleteDocument extends Command {
// //   constructor(folder_id, document_id) {
// //     super();
// //     this.folder_id = folder_id;
// //     this.document_id = document_id;
// //   }
// // }

// class DeleteManyDocuments extends Command {
//   constructor(folder_id, usergroup_id, document_ids) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_ids = document_ids;
//   }
// }

// class AttachFileToDocument extends Command {
//   constructor(folder_id, usergroup_id, document_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//   }
// }

// class DetachFileFromDocument extends Command {
//   constructor(folder_id, usergroup_id, document_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//   }
// }

// class FlushFileContainer extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class AddDocument extends Command {
//   constructor(
//     folder_id,
//     usergroup_id,
//     document_id,
//     union_id,
//     attributes,
//     files,
//     mark_as_modified,
//     is_created_first_time,
//     is_blocked
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.union_id = union_id;
//     this.attributes = attributes;
//     this.files = files;
//     this.mark_as_modified = mark_as_modified;
//     this.is_created_first_time = is_created_first_time;
//     this.is_blocked = is_blocked;
//   }
// }

// class AddDocumentModel extends Command {
//   constructor(folder_id, usergroup_id, doc, mark_as_modified) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.doc = doc;
//     this.mark_as_modified = mark_as_modified;
//   }
// }

// class DuplicateDocumentToUsergroup extends Command {
//   constructor(
//     folder_id,
//     source_usergroup_id,
//     target_usergroup_id,
//     document_id
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.source_usergroup_id = source_usergroup_id;
//     this.target_usergroup_id = target_usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class DuplicateManyDocumentsToUsergroup extends Command {
//   constructor(
//     folder_id,
//     source_usergroup_id,
//     target_usergroup_id,
//     document_ids
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.source_usergroup_id = source_usergroup_id;
//     this.target_usergroup_id = target_usergroup_id;
//     this.document_ids = document_ids;
//   }
// }


// class ValidateDocument extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class ValidateDocumentAgainstConstraint extends Command {
//   constructor(folder_id, usergroup_id, document_id, parameters, error_message) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.parameters = parameters;
//     this.error_message = error_message;
//   }
// }

// class ValidateDocumentAgainstAttributeRegexValidationConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstAttributeTogetherRegexValidationConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstUniqueTogetherConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstAttributeHasPreviousValueConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstHasFileConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstHasApprovalConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstSingleUnionConstraint extends ValidateDocumentAgainstConstraint {}
// class ValidateDocumentAgainstFilenamePatternConstraint extends ValidateDocumentAgainstConstraint {}

// class AttachFilesToDocumentUsingPattern extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class AllocateFilesToDocumentsUsingPattern extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class GetSpareFiles extends Command {
//   constructor(folder_id, usergroup_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//   }
// }

// class UpdateUploadProgress extends Command {
//   constructor(file_ids) {
//     super();
//     this.file_ids = file_ids;
//   }
// }

// class DownloadExcelFile extends Command {
//   constructor(filename, aoa) {
//     super();
//     this.filename = filename; // Name of downloaded file
//     this.aoa = aoa; // array of arrays
//   }
// }

// class DownloadJsonFile extends Command {
//   constructor(filename, data) {
//     super();
//     this.filename = filename; // Name of downloaded file
//     this.data = data; // data to be serialized in JSON
//   }
// }

// class GetPdfMergeFiles extends Command {}

// class UploadPdfMergeFile extends Command {
//   constructor(id, order, file) {
//     super();
//     this.id = id;
//     this.order = order;
//     // Здесь file это https://developer.mozilla.org/ru/docs/Web/API/File
//     this.file = file;
//   }
// }

// class PushDocumentButton extends Command {
//   constructor(folder_id, usergroup_id, document_id, action) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.action = action;
//   }
// }

// class PerformActionOnDocuments extends Command {
//   constructor(
//     handler,
//     username,
//     folder_id = null,
//     usergroup_id = null,
//     document_ids = []
//   ) {
//     super();
//     this.handler = handler;
//     this.username = username;
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_ids = document_ids;
//   }
// }

// class UpdatePdfMergeFile extends Command {
//   constructor(id, order, page_from, page_to, angle) {
//     super();
//     this.id = id;
//     this.order = order;
//     this.page_from = page_from;
//     this.page_to = page_to;
//     this.angle = angle;
//   }
// }

// class DeletePdfMergeFile extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class DeleteAllPdfMergeFiles extends Command {}

// class DownloadPdfMergeResult extends Command {
//   constructor(keep_bookmarks, add_filenames_as_bookmarks) {
//     super();
//     this.keep_bookmarks = keep_bookmarks;
//     this.add_filenames_as_bookmarks = add_filenames_as_bookmarks;
//   }
// }

// class DownloadPdfMixResult extends Command {}

// class GetShareFiles extends Command {}

class UploadFile extends Command {
  constructor(file) {
    super();
    this.file = file; //https://developer.mozilla.org/ru/docs/Web/API/File
  }
}

class UploadFileByLink extends Command {
  constructor(id, link, file) {
    super();
    this.id = id;
    this.link = link;
    this.file = file; //https://developer.mozilla.org/ru/docs/Web/API/File
  }
}

class DownloadFileByLink extends Command {
  constructor(link,name, size) {
    super();
    this.link = link;
    this.name = name;
    this.size = size;
  }
}

// class DeleteShareFile extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class DownloadShareFile extends Command {
//   constructor(id, name, size, inline) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.size = size;
//     this.inline = inline;
//   }
// }

// class GetUserGroups extends Command {}

// class AddUserGroup extends Command {
//   constructor(name, slug, is_private) {
//     super();
//     this.name = name;
//     this.slug = slug;
//     this.is_private = is_private;
//   }
// }

// class UpdateUserGroup extends Command {
//   constructor(id, name, slug, is_private) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.slug = slug;
//     this.is_private = is_private;
//   }
// }

// class DeleteUserGroup extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class AddUserToUserGroup extends Command {
//   constructor(id, username) {
//     super();
//     this.id = id;
//     this.username = username;
//   }
// }

// class DeleteUserFromUserGroup extends Command {
//   constructor(id, username) {
//     super();
//     this.id = id;
//     this.username = username;
//   }
// }

// class SetCurrentUserGroup extends Command {
//   constructor(usergroup) {
//     super();
//     this.usergroup = usergroup;
//   }
// }

// class GetFlows extends Command {
//   constructor(query_obj) {
//     super();
//     this.query = query_obj;
//   }
// }

// class AddFlow extends Command {
//   constructor(name, trigger, is_active, is_multiple, message_if_fail, process) {
//     super();
//     this.name = name;
//     this.trigger = trigger;
//     this.is_active = is_active;
//     this.is_multiple = is_multiple;
//     this.message_if_fail = message_if_fail;
//     this.process = process;
//   }
// }

// class UpdateFlow extends Command {
//   constructor(
//     id,
//     name,
//     trigger,
//     is_active,
//     is_multiple,
//     message_if_fail,
//     process
//   ) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.trigger = trigger;
//     this.is_active = is_active;
//     this.is_multiple = is_multiple;
//     this.message_if_fail = message_if_fail;
//     this.process = process;
//   }
// }

// class DeleteFlow extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetFlowItem extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetManyFlowItems extends Command {
//   constructor(query_obj) {
//     super();
//     this.query = query_obj;
//   }
// }

// class RestartFlowItem extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetFlowItemSteps extends Command {
//   constructor(flowitem_id) {
//     super();
//     this.flowitem_id = flowitem_id;
//   }
// }

// class DropSelfTestingQuestions extends Command {}

// class AddSelfTestingQuestion extends Command {
//   constructor(id, question_text, answers) {
//     super();
//     this.id = id;
//     this.question = question_text;
//     this.answers = answers;
//   }
// }

// class GetManyDocumentsApprovals extends Command {
//   constructor(query_obj, offset, limit, sort_by, sort_asc) {
//     super();
//     this.query = query_obj;
//     this.offset = offset;
//     this.limit = limit;
//     this.sort_by = sort_by;
//     this.sort_asc = sort_asc;
//   }
// }

// class GetDocumentApprovals extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class AddDocumentApproval extends Command {
//   constructor(folder_id, usergroup_id, document_id, username) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.username = username;
//   }
// }

// class UpdateDocumentApproval extends Command {
//   constructor(
//     folder_id,
//     usergroup_id,
//     document_id,
//     approval_id,
//     state,
//     comments
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.approval_id = approval_id;
//     this.state = state;
//     this.comments = comments;
//   }
// }

// class DeleteDocumentApproval extends Command {
//   constructor(folder_id, usergroup_id, document_id, approval_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.approval_id = approval_id;
//   }
// }

// class DelegateDocumentApproval extends Command {
//   constructor(
//     folder_id,
//     usergroup_id,
//     document_id,
//     approval_id,
//     username,
//     with_return
//   ) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.approval_id = approval_id;
//     this.username = username;
//     this.with_return = with_return;
//   }
// }

// class GetDocumentApprovalSpareFiles extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class UploadDocumentApprovalFile extends Command {
//   constructor(folder_id, usergroup_id, document_id, file_id, file) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//     // Здесь file это https://developer.mozilla.org/ru/docs/Web/API/File
//     this.file = file;
//   }
// }

// class DeleteDocumentApprovalFile extends Command {
//   constructor(folder_id, usergroup_id, document_id, file_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.file_id = file_id;
//   }
// }

// class EmptyCart extends Command {}
// class GetCart extends Command {}

// class AddDocumentToCart extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class AddManyDocumentsToCart extends Command {
//   constructor(folder_id, usergroup_id, document_ids) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_ids = document_ids;
//   }
// }

// class RemoveDocumentFromCart extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class CreateDocumentApprovalFlow extends Command {
//   constructor(document_id) {
//     super();
//     this.document_id = document_id;
//   }
// }

// class AddDocumentApprovalFlowStep extends Command {
//   constructor(document_id) {
//     super();
//     this.document_id = document_id;
//   }
// }

// class DeleteDocumentApprovalFlowStep extends Command {
//   constructor(document_id, index) {
//     super();
//     this.document_id = document_id;
//     this.index = index;
//   }
// }

// class AttachUserToDocumentApprovalFlowStep extends Command {
//   constructor(document_id, index, username) {
//     super();
//     this.document_id = document_id;
//     this.index = index;
//     this.username = username;
//   }
// }

// class DeleteUserFromDocumentApprovalFlowStep extends AttachUserToDocumentApprovalFlowStep {}

// class AbstractDocumentApprovalFlowCommand extends Command {
//   constructor(folder_id, usergroup_id, document_id) {
//     super();
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//   }
// }

// class GetDocumentApprovalFlow extends AbstractDocumentApprovalFlowCommand {}
// class StartDocumentApprovalFlow extends AbstractDocumentApprovalFlowCommand {}
// class StopDocumentApprovalFlow extends AbstractDocumentApprovalFlowCommand {}
// class SetDocumentApprovalFlow extends AbstractDocumentApprovalFlowCommand {}

// class GetServerSettings extends Command {}
// class UpdateServerSetting extends Command {
//   constructor(id, value) {
//     super();
//     this.id = id;
//     this.value = value;
//   }
// }

// class GetMailBoxes extends Command {}

// class AddMailBox extends Command {
//   constructor(
//     out_protocol,
//     out_encryption,
//     out_port,
//     out_server,
//     in_protocol,
//     in_encryption,
//     in_port,
//     in_server,
//     username,
//     password,
//     name
//   ) {
//     super();
//     this.out_protocol = out_protocol;
//     this.out_encryption = out_encryption;
//     this.out_port = out_port;
//     this.out_server = out_server;
//     this.in_protocol = in_protocol;
//     this.in_encryption = in_encryption;
//     this.in_port = in_port;
//     this.in_server = in_server;
//     this.username = username;
//     this.password = password;
//     this.name = name;
//   }
// }

// class UpdateMailBox extends Command {
//   constructor(
//     id,
//     out_protocol,
//     out_encryption,
//     out_port,
//     out_server,
//     in_protocol,
//     in_encryption,
//     in_port,
//     in_server,
//     username,
//     password,
//     name
//   ) {
//     super();
//     this.id = id;
//     this.out_protocol = out_protocol;
//     this.out_encryption = out_encryption;
//     this.out_port = out_port;
//     this.out_server = out_server;
//     this.in_protocol = in_protocol;
//     this.in_encryption = in_encryption;
//     this.in_port = in_port;
//     this.in_server = in_server;
//     this.username = username;
//     this.password = password;
//     this.name = name;
//   }
// }

// class DeleteMailBox extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetMailChannels extends Command {}

// class AddMailChannel extends Command {
//   constructor(name, folder, storage_path, settings, is_active) {
//     super();
//     this.name = name;
//     this.folder = folder;
//     this.storage_path = storage_path;
//     this.settings = settings;
//     this.is_active = is_active;
//   }
// }

// class UpdateMailChannel extends Command {
//   constructor(id, name, folder, storage_path, settings, is_active) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.folder = folder;
//     this.storage_path = storage_path;
//     this.settings = settings;
//     this.is_active = is_active;
//   }
// }

// class DeleteMailChannel extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class AddMailChannelToMailBox extends Command {
//   constructor(mailbox_id, mailchannel_id) {
//     super();
//     this.mailbox_id = mailbox_id;
//     this.mailchannel_id = mailchannel_id;
//   }
// }

// class DeleteMailChannelFromMailBox extends Command {
//   constructor(mailbox_id, mailchannel_id) {
//     super();
//     this.mailbox_id = mailbox_id;
//     this.mailchannel_id = mailchannel_id;
//   }
// }

// class FetchMailChannel extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class GetMailMessages extends Command {
//   constructor(query_obj) {
//     super();
//     this.query = query_obj;
//   }
// }

// class DeleteMailMessage extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

// class AbstractDownloadMailMessage extends Command {
//   constructor(id, format) {
//     super();
//     this.id = id;
//     this.format = format;
//   }
// }

// class DownloadMailMessageInTextFormat extends AbstractDownloadMailMessage {
//   constructor(id) {
//     super(id, "text");
//   }
// }

// class DownloadMailMessageInHtmlFormat extends AbstractDownloadMailMessage {
//   constructor(id) {
//     super(id, "html");
//   }
// }

// class DownloadMailMessageInRawFormat extends AbstractDownloadMailMessage {
//   constructor(id) {
//     super(id, "raw");
//   }
// }

// class DownloadMailMessageAttachment extends Command {
//   constructor(message_id, id, name, size, inline) {
//     super();
//     this.message_id = message_id;
//     this.id = id;
//     this.name = name;
//     this.size = size;
//     this.inline = inline;
//   }
// }

// // CONTEXT
// class GetDocumentAttributesContext extends Command {
//   constructor(ctx_id, ctx_name, folder_id, document_id, is_raw_attribute) {
//     super();
//     this.ctx_id = ctx_id;
//     this.ctx_name = ctx_name;
//     this.folder_id = folder_id;
//     this.document_id = document_id;
//     this.is_raw_attribute = is_raw_attribute;
//   }
// }

// class GetDocumentPreviousAttributeContext extends Command {
//   constructor(
//     ctx_id,
//     ctx_name,
//     folder_id,
//     usergroup_id,
//     document_id,
//     attribute_name,
//     is_raw_attribute,
//     count
//   ) {
//     super();
//     this.ctx_id = ctx_id;
//     this.ctx_name = ctx_name;
//     this.folder_id = folder_id;
//     this.usergroup_id = usergroup_id;
//     this.document_id = document_id;
//     this.attribute_name = attribute_name;
//     this.is_raw_attribute = is_raw_attribute;
//     this.count = count;
//   }
// }

// class GetUserEmailContext extends Command {
//   constructor(ctx_id, ctx_name) {
//     super();
//     this.ctx_id = ctx_id;
//     this.ctx_name = ctx_name;
//   }
// }

// class GetCounters extends Command {}

// class AddCounter extends Command {
//   constructor(name, description, value, increment) {
//     super();
//     this.name = name;
//     this.description = description;
//     this.value = value;
//     this.increment = increment;
//   }
// }

// class UpdateCounter extends Command {
//   constructor(id, name, description, value, increment) {
//     super();
//     this.id = id;
//     this.name = name;
//     this.description = description;
//     this.value = value;
//     this.increment = increment;
//   }
// }

// class DeleteCounter extends Command {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
// }

export {
  Command,
  Notify,
  NotifyApiError,
  // USER
  LoginWithCredentials,
  MyCredentials,
  RefreshTokens,
  Logout,
  // CDN SERVERS
  GetCdnServers,
  // FILE
  GetFiles,
  GetFileServers,
  DeleteFile,
  UploadFile,
  UploadFileByLink,
  DownloadFile,
  DownloadFileByLink,
  // GetUsers,
  // SetUser,
  // DeleteUser,
  // GetUserReplacements,
  // AddUserReplacement,
  // DeleteUserReplacement,
  // GetUserReplacementsOfUser,
  // AddUserReplacementToUser,
  // DeleteUserReplacementFromUser,
  // GetOnBehalfUsers,
  // SetOnBehalfUser,
  // DeleteOnBehalfUser,
  // // USER GROUPS
  // GetUserGroups,
  // AddUserGroup,
  // UpdateUserGroup,
  // DeleteUserGroup,
  // AddUserToUserGroup,
  // DeleteUserFromUserGroup,
  // SetCurrentUserGroup,
  // // FOLDERS
  // GetFolders,
  // AddFolder,
  // DeleteFolder,
  // UpdateFolder,
  // // ROLES
  // GetRoles,
  // AddRole,
  // DeleteRole,
  // // USER FOLDER SETTINGS
  // GetUserFolderSettings,
  // AddUserFolderSettings,
  // UpdateUserFolderSettings,
  // DeleteUserFolderSettings,
  // // PERMISSIONS
  // GetPermissions,
  // AddPermission,
  // DeletePermission,
  // GetUserPermissions,
  // GetUserPermissionsForFolder,
  // GetUserSearchSchema,
  // SetUserSearchSchema,
  // DeleteUserSearchSchema,
  // // DOCUMENTS
  // GetManyDocuments,
  // GetDocument,
  // GetWaitingDocumentApprovals,
  // AddDocument,
  // AddDocumentModel,
  // DuplicateDocumentToUsergroup,
  // DuplicateManyDocumentsToUsergroup,
  // SetDocumentAttribute,
  // SaveDocumentsInFolder,
  // SaveManyDocuments,
  // MarkDocumentAsDeleted,
  // MarkDocumentAsNotDeleted,
  // DeleteManyDocuments,
  // PushDocumentButton,
  // PerformActionOnDocuments,
  // // DOCUMENT APPROVALS
  // GetManyDocumentsApprovals,
  // GetDocumentApprovals,
  // AddDocumentApproval,
  // UpdateDocumentApproval,
  // DeleteDocumentApproval,
  // DelegateDocumentApproval,
  // GetDocumentApprovalSpareFiles,
  // UploadDocumentApprovalFile,
  // DeleteDocumentApprovalFile,
  // // DOCUMENT APPROVAL FLOW
  // CreateDocumentApprovalFlow,
  // AddDocumentApprovalFlowStep,
  // DeleteDocumentApprovalFlowStep,
  // AttachUserToDocumentApprovalFlowStep,
  // DeleteUserFromDocumentApprovalFlowStep,
  // GetDocumentApprovalFlow,
  // StartDocumentApprovalFlow,
  // StopDocumentApprovalFlow,
  // SetDocumentApprovalFlow,
  // // DOCUMENT FILES
  // UploadFileToFolder,
  // DownloadFileFromFolder,
  // DownloadManyDocumentsFilesAsArchive,
  // DownloadDocumentFilesAsArchive,
  // DeleteFileFromFolder,
  // UpdateFileFromFolder,
  // AttachFileToDocument,
  // DetachFileFromDocument,
  // FlushFileContainer,
  // AttachFilesToDocumentUsingPattern,
  // AllocateFilesToDocumentsUsingPattern,
  // GetSpareFiles,
  // UpdateUploadProgress,
  // GetFileInfo,
  // // CART
  // GetCart,
  // AddDocumentToCart,
  // AddManyDocumentsToCart,
  // RemoveDocumentFromCart,
  // EmptyCart,
  // // SERVER SETTINGS
  // GetServerSettings,
  // UpdateServerSetting,
  // // MAIL BOX
  // GetMailBoxes,
  // AddMailBox,
  // UpdateMailBox,
  // DeleteMailBox,
  // // MAIL CHANNEL
  // GetMailChannels,
  // AddMailChannel,
  // UpdateMailChannel,
  // DeleteMailChannel,
  // AddMailChannelToMailBox,
  // DeleteMailChannelFromMailBox,
  // FetchMailChannel,
  // // MAIL MESSAGE
  // GetMailMessages,
  // DeleteMailMessage,
  // DownloadMailMessageInTextFormat,
  // DownloadMailMessageInHtmlFormat,
  // DownloadMailMessageInRawFormat,
  // DownloadMailMessageAttachment,
  // // VALIDATION
  // ValidateDocument,
  // ValidateDocumentAgainstAttributeRegexValidationConstraint,
  // ValidateDocumentAgainstAttributeTogetherRegexValidationConstraint,
  // ValidateDocumentAgainstUniqueTogetherConstraint,
  // ValidateDocumentAgainstAttributeHasPreviousValueConstraint,
  // ValidateDocumentAgainstHasFileConstraint,
  // ValidateDocumentAgainstHasApprovalConstraint,
  // ValidateDocumentAgainstSingleUnionConstraint,
  // ValidateDocumentAgainstFilenamePatternConstraint,
  // // EXCEL
  // DownloadExcelFile,
  // // JSON
  // DownloadJsonFile,
  // // SERVICE - PDF MERGE
  // GetPdfMergeFiles,
  // UpdatePdfMergeFile,
  // UploadPdfMergeFile,
  // DeletePdfMergeFile,
  // DeleteAllPdfMergeFiles,
  // DownloadPdfMergeResult,
  // DownloadPdfMixResult,
  // // SERVICE - SHARE FILE
  // GetShareFiles,
  // UploadShareFile,
  // DeleteShareFile,
  // DownloadShareFile,
  // // SERVICE - SELF TESTING
  // DropSelfTestingQuestions,
  // AddSelfTestingQuestion,
  // // SERVICE - COUNTER
  // GetCounters,
  // AddCounter,
  // UpdateCounter,
  // DeleteCounter,
  // // WORKFLOW - FLOW
  // GetFlows,
  // AddFlow,
  // UpdateFlow,
  // DeleteFlow,
  // // WORKFLOW - FLOW ITEM
  // GetFlowItem,
  // GetManyFlowItems,
  // RestartFlowItem,
  // GetFlowItemSteps,
  // // CONTEXT
  // GetDocumentAttributesContext,
  // GetDocumentPreviousAttributeContext,
  // GetUserEmailContext,
};
