import { DataClass } from "../domain/dataclass";
// import { Info } from "./api_responses/models/info";
import { Tokens } from "./api_responses/models/tokens";
import {
  User
} from "./api_responses/models/user";
// import {
//   Single as FolderSingle,
//   List as FolderList,
// } from "./api_responses/models/folder";
// import {
//   Single as RoleSingle,
//   List as RoleList,
// } from "./api_responses/models/role";
// import {
//   Single as UserFolderSettingSingle,
//   List as UserFolderSettingList,
// } from "./api_responses/models/user_folder_setting";
// import { List as PermissionList } from "./api_responses/models/permission";
// import {
//   Single as DocumentSingle,
//   List as DocumentList,
// } from "./api_responses/models/document";
// import {
//   Single as DocumentApprovalSingle,
//   List as DocumentApprovalList,
//   SearchList as DocumentApprovalSearchList,
// } from "./api_responses/models/document_approval";
// import { Single as ApprovalFlowSingle } from "./api_responses/models/approval_flow";
// import {
//   Single as FileSingle,
//   List as FileList,
// } from "./api_responses/models/file";
// import { Single as SearchSchemaSingle } from "./api_responses/models/search_schema";
// import {
//   Single as PdfMergeFileSingle,
//   List as PdfMergeFileList,
// } from "./api_responses/models/pdf_merge_file";
// import {
//   Single as UserGroupSingle,
//   List as UserGroupList,
// } from "./api_responses/models/usergroup";
// import {
//   Single as FlowSingle,
//   List as FlowList,
// } from "./api_responses/models/flow";
// import {
//   Single as FlowItemSingle,
//   List as FlowItemList,
// } from "./api_responses/models/flow_item";
// import { List as FlowItemStepList } from "./api_responses/models/flow_item_step";
// import {
//   Single as ServerSettingSingle,
//   List as ServerSettingList,
// } from "./api_responses/models/server_setting";
// import {
//   Single as MailBoxSingle,
//   List as MailBoxList,
// } from "./api_responses/models/mailbox";
// import {
//   Single as MailChannelSingle,
//   List as MailChannelList,
// } from "./api_responses/models/mail_channel";
// import { List as MailMessageList } from "./api_responses/models/mail_message";
// import {
//   Single as CounterSingle,
//   List as CounterList,
// } from "./api_responses/models/counter";

class NotImplementedError extends Error { }

class Request extends DataClass {
  get schema() {
    return {
      type: "object",
      properties: {},
      additionalProperties: false,
    };
  }
}

class Response extends DataClass { }

class NegativeResponse extends Response {
  get schema() {
    return {
      type: "object",
      properties: {
        code: { type: "string" },
      },
      additionalProperties: false,
    };
  }
}
// class EmptyPositiveResponse extends Response {
//   get schema() {
//     return {
//       type: "object",
//       properties: {},
//       additionalProperties: false,
//     };
//   }
// }

// class PositiveFileResponse extends Response {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         file: { type: "object" },
//         name: { type: "string" },
//         size: { type: "number" },
//       },
//       additionalProperties: false,
//     };
//   }
// }

class LoginCredentialsRequest extends Request {
  get schema() {
    return {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
      },
      additionalProperties: false,
    };
  }
}

class LoginCredentialsResponse extends Response {
  get schema() {
    return Tokens;
  }
}

class MyCredentialsRequest extends Request { }
class MyCredentialsResponse extends Response {
  get schema() {
    return User;
  }
}

class RefreshTokensRequest extends Request { }
class RefreshTokensResponse extends Response {
  get schema() {
    return Tokens;
  }
}

// class LoginTokenRequest extends Request {}
// class LoginTokenResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class GetInfoRequest extends Request {}
// class GetInfoResponse extends Response {
//   get schema() {
//     return Info;
//   }
// }

// class GetUsersRequest extends Request {}
// class GetUsersResponse extends Response {
//   get schema() {
//     return UserList;
//   }
// }

// class SetUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//         is_active: { type: "boolean" },
//         access_group_regex: { type: "string" },
//         role: { type: "string" },
//         role_inside_group: { type: "string" },
//         role_outside_group: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SetUserResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class DeleteUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserResponse extends EmptyPositiveResponse {}

// class GetUserReplacementsRequest extends Request {}
// class GetUserReplacementsResponse extends Response {
//   get schema() {
//     return UserList;
//   }
// }

// class AddUserReplacementRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddUserReplacementResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class DeleteUserReplacementRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserReplacementResponse extends EmptyPositiveResponse {}

// class GetUserReplacementsOfUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetUserReplacementsOfUserResponse extends Response {
//   get schema() {
//     return UserList;
//   }
// }

// class AddUserReplacementToUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username_to_be_replaced: { type: "string" },
//         replaced_with_username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddUserReplacementToUserResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class DeleteUserReplacementFromUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username_to_be_replaced: { type: "string" },
//         replaced_with_username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserReplacementFromUserResponse extends EmptyPositiveResponse {}

// class GetOnBehalfUsersRequest extends Request {}
// class GetOnBehalfUsersResponse extends Response {
//   get schema() {
//     return UserList;
//   }
// }

// class SetOnBehalfUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SetOnBehalfUserResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class DeleteOnBehalfUserRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteOnBehalfUserResponse extends Response {
//   get schema() {
//     return UserSingle;
//   }
// }

// class GetUserGroupsRequest extends Request {}
// class GetUserGroupsResponse extends Response {
//   get schema() {
//     return UserGroupList;
//   }
// }

// // class GetMyUserGroupsRequest extends GetUserGroupsRequest {}
// // class GetMyUserGroupsResponse extends GetUserGroupsResponse {}

// class AddUserGroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//         slug: { type: "string" },
//         is_private: { type: "boolean" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddUserGroupResponse extends Response {
//   get schema() {
//     return UserGroupSingle;
//   }
// }

// class SetUserGroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         name: { type: "string" },
//         slug: { type: "string" },
//         is_private: { type: "boolean" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SetUserGroupResponse extends Response {
//   get schema() {
//     return UserGroupSingle;
//   }
// }

// class DeleteUserGroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserGroupResponse extends EmptyPositiveResponse {}

// class AddUserToUserGroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddUserToUserGroupResponse extends Response {
//   get schema() {
//     return UserGroupSingle;
//   }
// }

// class DeleteUserFromUserGroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserFromUserGroupResponse extends Response {
//   get schema() {
//     return UserGroupSingle;
//   }
// }

// class GetFoldersRequest extends Request {}
// class GetFoldersResponse extends Response {
//   get schema() {
//     return FolderList;
//   }
// }

// class AddFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//         storage_path: { type: "string" },
//         master_usergroup_slug: { type: "string" },
//         access_group: { type: "string" },
//         settings: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddFolderResponse extends Response {
//   get schema() {
//     return FolderSingle;
//   }
// }

// class UpdateFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         name: { type: "string" },
//         storage_path: { type: "string" },
//         master_usergroup_slug: { type: "string" },
//         access_group: { type: "string" },
//         settings: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateFolderResponse extends Response {
//   get schema() {
//     return FolderSingle;
//   }
// }

// class DeleteFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteFolderResponse extends EmptyPositiveResponse {}

// class UploadFileToFolderRequest extends Request {
//   // file = https://developer.mozilla.org/ru/docs/Web/API/File
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         original_file: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UploadFileToFolderResponse extends EmptyPositiveResponse {}

// class DownloadFileFromFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadFileFromFolderResponse extends PositiveFileResponse {}

// class DownloadManyDocumentsFilesAsArchiveRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_ids: { type: "array", items: { type: "string" } },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadManyDocumentsFilesAsArchiveResponse extends PositiveFileResponse {}

// class DownloadDocumentFilesAsArchiveRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadDocumentFilesAsArchiveResponse extends PositiveFileResponse {}

// class DeleteFileFromFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteFileFromFolderResponse extends EmptyPositiveResponse {}

// class UpdateFileFromFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         name: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }

// class UpdateFileFromFolderResponse extends Response {
//   get schema() {
//     return FileSingle;
//   }
// }

// class GetFileInfoRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         // folder_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetFileInfoResponse extends Response {
//   get schema() {
//     return FileSingle;
//   }
// }

// class GetRolesRequest extends Request {}
// class GetRolesResponse extends Response {
//   get schema() {
//     return RoleList;
//   }
// }

// class AddRoleRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddRoleResponse extends Response {
//   get schema() {
//     return RoleSingle;
//   }
// }

// class DeleteRoleRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteRoleResponse extends EmptyPositiveResponse {}

// class GetUserFolderSettingsRequest extends Request {}
// class GetUserFolderSettingsResponse extends Response {
//   get schema() {
//     return UserFolderSettingList;
//   }
// }

// class AddUserFolderSettingsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         username: { type: "string" },
//         folder_id: { type: "number" },
//         usergroup_slug: { type: "string" },
//         role: { type: ["null", "string"] },
//         search_schema: { type: ["null", "array"] },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddUserFolderSettingsResponse extends Response {
//   get schema() {
//     return UserFolderSettingSingle;
//   }
// }

// class UpdateUserFolderSettingsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "number" },
//         username: { type: "string" },
//         folder_id: { type: "number" },
//         usergroup_slug: { type: "string" },
//         role: { type: ["null", "string"] },
//         search_schema: { type: ["null", "array"] },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateUserFolderSettingsResponse extends Response {
//   get schema() {
//     return UserFolderSettingSingle;
//   }
// }

// class DeleteUserFolderSettingsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "number" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserFolderSettingsResponse extends EmptyPositiveResponse {}

// class GetPermissionsRequest extends Request {}
// class GetPermissionsResponse extends Response {
//   get schema() {
//     return PermissionList;
//   }
// }

// // OK
// class AddPermissionRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         role: { type: "string" },
//         permission: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }

// class AddPermissionResponse extends Response {
//   get schema() {
//     return RoleSingle;
//   }
// }

// class DeletePermissionRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         role: { type: "string" },
//         permission: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeletePermissionResponse extends EmptyPositiveResponse {}

// class GetUserPermissionsRequest extends Request {}
// class GetUserPermissionsResponse extends Response {
//   get schema() {
//     return PermissionList;
//   }
// }

// class GetUserPermissionsForFolderRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetUserPermissionsForFolderResponse extends Response {
//   get schema() {
//     return PermissionList;
//   }
// }

// class GetUserSearchSchemaRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetUserSearchSchemaResponse extends Response {
//   get schema() {
//     return SearchSchemaSingle;
//   }
// }

// class SetUserSearchSchemaRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         search_schema: SearchSchemaSingle,
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SetUserSearchSchemaResponse extends EmptyPositiveResponse {}

// class DeleteUserSearchSchemaRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteUserSearchSchemaResponse extends EmptyPositiveResponse {}

// class GetDocumentRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetDocumentResponse extends Response {
//   get schema() {
//     return DocumentSingle;
//   }
// }

// class GetPreviousDocumentsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         count: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetPreviousDocumentsResponse extends Response {
//   get schema() {
//     return DocumentList;
//   }
// }

// class PushDocumentButtonRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         action: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class PushDocumentButtonResponse extends EmptyPositiveResponse {}

// class GetManyDocumentsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         query: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetManyDocumentsResponse extends Response {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         documents: DocumentList,
//         count: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }

// // class SaveDocumentRequest extends Request {
// //   get keys() {
// //     return ["folder_id", "id", "data", "files"];
// //   }
// // }
// // class SaveDocumentResponse extends EmptyPositiveResponse {}

// class SaveManyDocumentsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         docs: { type: "array" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SaveManyDocumentsResponse extends Response {
//   get schema() {
//     return DocumentList;
//   }
// }

// // class DeleteDocumentRequest extends Request {
// //   get keys() {
// //     return ["folder_id", "id"];
// //   }
// // }
// // class DeleteDocumentResponse extends EmptyPositiveResponse {}

// class DeleteManyDocumentsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         ids: { type: "array" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteManyDocumentsResponse extends EmptyPositiveResponse {}

// class DuplicateDocumentToUsergroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         source_usergroup_id: { type: "integer" },
//         target_usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DuplicateDocumentToUsergroupResponse extends Response {
//   get schema() {
//     return DocumentSingle;
//   }
// }

// class DuplicateManyDocumentsToUsergroupRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         source_usergroup_id: { type: "integer" },
//         target_usergroup_id: { type: "integer" },
//         document_ids: { type: "array", items: { type: "string" } },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DuplicateManyDocumentsToUsergroupResponse extends EmptyPositiveResponse {}

// class GetSpareFilesRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetSpareFilesResponse extends Response {
//   get schema() {
//     return FileList;
//   }
// }

// class GetUploadProgressRequest extends Request {}

// class GetUploadProgressResponse extends Response {
//   get schema() {
//     return {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           file_id: { type: "string" },
//           loaded: { type: "integer" },
//         },
//         additionalProperties: false,
//       },
//     };
//   }
// }

// class GetPdfMergeFilesRequest extends Request {}
// class GetPdfMergeFilesResponse extends Response {
//   get schema() {
//     return PdfMergeFileList;
//   }
// }

// class UploadPdfMergeFileRequest extends Request {
//   // file = https://developer.mozilla.org/ru/docs/Web/API/File
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         order: { type: "integer" },
//         original_file: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UploadPdfMergeFileResponse extends Response {
//   get schema() {
//     return PdfMergeFileSingle;
//   }
// }

// class UpdatePdfMergeFileRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         order: { type: "integer" },
//         page_from: { type: "integer" },
//         page_to: { type: "integer" },
//         angle: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdatePdfMergeFileResponse extends Response {
//   get schema() {
//     return PdfMergeFileSingle;
//   }
// }

// class DeletePdfMergeFileRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeletePdfMergeFileResponse extends EmptyPositiveResponse {}

// class DownloadPdfMergeResultRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         keep_bookmarks: { type: "boolean" },
//         add_filenames_as_bookmarks: { type: "boolean" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadPdfMergeResultResponse extends PositiveFileResponse {}

// class DownloadPdfMixResultRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {},
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadPdfMixResultResponse extends PositiveFileResponse {}

// class GetShareFilesRequest extends Request {}
// class GetShareFilesResponse extends Response {
//   get schema() {
//     return FileList;
//   }
// }

// class UploadShareFileRequest extends Request {
//   // file = https://developer.mozilla.org/ru/docs/Web/API/File
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         original_file: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UploadShareFileResponse extends EmptyPositiveResponse {}

// class DownloadShareFileRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadShareFileResponse extends PositiveFileResponse {}

// class DeleteShareFileRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteShareFileResponse extends EmptyPositiveResponse {}

// class GetFlowsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         query: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetFlowsResponse extends Response {
//   get schema() {
//     return FlowList;
//   }
// }

// class AddFlowRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//         trigger: { type: "string" },
//         is_active: { type: "boolean" },
//         is_multiple: { type: "boolean" },
//         message_if_fail: { type: "boolean" },
//         process: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddFlowResponse extends Response {
//   get schema() {
//     return FlowSingle;
//   }
// }

// class UpdateFlowRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         name: { type: "string" },
//         trigger: { type: "string" },
//         is_active: { type: "boolean" },
//         is_multiple: { type: "boolean" },
//         message_if_fail: { type: "boolean" },
//         process: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateFlowResponse extends Response {
//   get schema() {
//     return FlowSingle;
//   }
// }

// class DeleteFlowRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteFlowResponse extends EmptyPositiveResponse {}

// class GetFlowItemRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetFlowItemResponse extends Response {
//   get schema() {
//     return FlowItemSingle;
//   }
// }

// class RestartFlowItemRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class RestartFlowItemResponse extends EmptyPositiveResponse {}

// class GetManyFlowItemsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         query: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetManyFlowItemsResponse extends Response {
//   get schema() {
//     return FlowItemList;
//   }
// }

// class GetFlowItemStepsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         flowitem_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetFlowItemStepsResponse extends Response {
//   get schema() {
//     return FlowItemStepList;
//   }
// }

// class GetManyDocumentsApprovalsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         query: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetManyDocumentsApprovalsResponse extends Response {
//   get schema() {
//     return DocumentApprovalSearchList;
//   }
// }

// class GetDocumentApprovalsRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetDocumentApprovalsResponse extends Response {
//   get schema() {
//     return DocumentApprovalList;
//   }
// }

// class AddDocumentApprovalRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         username: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddDocumentApprovalResponse extends Response {
//   get schema() {
//     return DocumentApprovalSingle;
//   }
// }

// class UpdateDocumentApprovalRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         approval_id: { type: "integer" },
//         state: { enum: ["APPROVED", "REJECTED", "DELEGATED", "NONE"] },
//         files: { type: "array", items: { type: "string" } },
//         comments: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateDocumentApprovalResponse extends Response {
//   get schema() {
//     return DocumentApprovalSingle;
//   }
// }

// class DeleteDocumentApprovalRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         approval_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteDocumentApprovalResponse extends EmptyPositiveResponse {}

// class DelegateDocumentApprovalRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         approval_id: { type: "integer" },
//         username: { type: "string" },
//         with_return: { type: "boolean" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DelegateDocumentApprovalResponse extends Response {
//   get schema() {
//     return DocumentApprovalList;
//   }
// }

// class GetDocumentApprovalSpareFilesRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetDocumentApprovalSpareFilesResponse extends Response {
//   get schema() {
//     return FileList;
//   }
// }

// class UploadDocumentApprovalFileRequest extends Request {
//   // file = https://developer.mozilla.org/ru/docs/Web/API/File
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         file_id: { type: "string" },
//         original_file: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UploadDocumentApprovalFileResponse extends EmptyPositiveResponse {}

// class DeleteDocumentApprovalFileRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         file_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteDocumentApprovalFileResponse extends EmptyPositiveResponse {}

// class GetWaitingDocumentApprovalsRequest extends Request {}
// class GetWaitingDocumentApprovalsResponse extends Response {
//   get schema() {
//     return DocumentApprovalList;
//   }
// }

// class EmptyCartRequest extends Request {}
// class EmptyCartResponse extends EmptyPositiveResponse {}

// class GetCartDocumentsRequest extends Request {}
// class GetCartDocumentsResponse extends Response {
//   get schema() {
//     return DocumentList;
//   }
// }

// class AddDocumentToCartRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddDocumentToCartResponse extends Response {
//   get schema() {
//     return DocumentSingle;
//   }
// }

// class AddManyDocumentsToCartRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_ids: { type: "array" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddManyDocumentsToCartResponse extends Response {
//   get schema() {
//     return DocumentList;
//   }
// }

// class RemoveDocumentFromCartRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class RemoveDocumentFromCartResponse extends EmptyPositiveResponse {}

// class AbstractDocumentApprovalFlowRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }

// class AbstractDocumentApprovalFlowResponse extends Response {
//   get schema() {
//     return ApprovalFlowSingle;
//   }
// }

// class GetDocumentApprovalFlowRequest extends AbstractDocumentApprovalFlowRequest {}
// class GetDocumentApprovalFlowResponse extends AbstractDocumentApprovalFlowResponse {}

// class SetDocumentApprovalFlowRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_id: { type: "string" },
//         steps: {
//           type: "array",
//           items: {
//             type: "array",
//             items: {
//               type: "string",
//             },
//             minItems: 1,
//           },
//           minItems: 1,
//         },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class SetDocumentApprovalFlowResponse extends AbstractDocumentApprovalFlowResponse {}

// class StartDocumentApprovalFlowRequest extends AbstractDocumentApprovalFlowRequest {}
// class StartDocumentApprovalFlowResponse extends AbstractDocumentApprovalFlowResponse {}

// class StopDocumentApprovalFlowRequest extends AbstractDocumentApprovalFlowRequest {}
// class StopDocumentApprovalFlowResponse extends AbstractDocumentApprovalFlowResponse {}

// class GetServerSettingsRequest extends Request {}
// class GetServerSettingsResponse extends Response {
//   get schema() {
//     return ServerSettingList;
//   }
// }

// class UpdateServerSettingRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         value: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateServerSettingResponse extends Response {
//   get schema() {
//     return ServerSettingSingle;
//   }
// }

// class GetMailBoxesRequest extends Request {}
// class GetMailBoxesResponse extends Response {
//   get schema() {
//     return MailBoxList;
//   }
// }

// class AddMailBoxRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         out_protocol: { enum: ["SMTP"] },
//         out_encryption: { enum: ["NONE", "SSL/TLS", "STARTTLS"] },
//         out_port: { type: "integer", minimum: 0, maximum: 1000 },
//         out_server: { type: "string" },

//         in_protocol: { enum: ["POP3", "IMAP"] },
//         in_encryption: { enum: ["NONE", "SSL/TLS", "STARTTLS"] },
//         in_port: { type: "integer", minimum: 0, maximum: 1000 },
//         in_server: { type: "string" },

//         username: { type: "string" },
//         password: { type: "string" },
//         name: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddMailBoxResponse extends Response {
//   get schema() {
//     return MailBoxSingle;
//   }
// }

// class UpdateMailBoxRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         out_protocol: { enum: ["SMTP"] },
//         out_encryption: { enum: ["NONE", "SSL/TLS", "STARTTLS"] },
//         out_port: { type: "integer", minimum: 0, maximum: 1000 },
//         out_server: { type: "string" },
//         in_protocol: { enum: ["POP3", "IMAP"] },
//         in_encryption: { enum: ["NONE", "SSL/TLS", "STARTTLS"] },
//         in_port: { type: "integer", minimum: 0, maximum: 1000 },
//         in_server: { type: "string" },
//         username: { type: "string" },
//         password: { type: "string" },
//         name: { type: "string" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateMailBoxResponse extends Response {
//   get schema() {
//     return MailBoxSingle;
//   }
// }

// class DeleteMailBoxRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteMailBoxResponse extends EmptyPositiveResponse {}

// class GetMailChannelsRequest extends Request {}
// class GetMailChannelsResponse extends Response {
//   get schema() {
//     return MailChannelList;
//   }
// }

// class AddMailChannelRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//         folder: { type: "string" },
//         storage_path: { type: "string" },
//         settings: { type: "object" },
//         is_active: { type: "boolean" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddMailChannelResponse extends Response {
//   get schema() {
//     return MailChannelSingle;
//   }
// }

// class UpdateMailChannelRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         name: { type: "string" },
//         folder: { type: "string" },
//         storage_path: { type: "string" },
//         settings: { type: "object" },
//         is_active: { type: "boolean" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateMailChannelResponse extends Response {
//   get schema() {
//     return MailChannelSingle;
//   }
// }

// class DeleteMailChannelRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteMailChannelResponse extends EmptyPositiveResponse {}

// class AddMailChannelToMailBoxRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         mailbox_id: { type: "integer" },
//         mailchannel_id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddMailChannelToMailBoxResponse extends Response {
//   get schema() {
//     return MailBoxSingle;
//   }
// }

// class DeleteMailChannelFromMailBoxRequest extends AddMailChannelToMailBoxRequest {}
// class DeleteMailChannelFromMailBoxResponse extends AddMailChannelToMailBoxResponse {}

// class FetchMailChannelRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class FetchMailChannelResponse extends EmptyPositiveResponse {}

// class GetMailMessagesRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         query: { type: "object" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class GetMailMessagesResponse extends Response {
//   get schema() {
//     return MailMessageList;
//   }
// }

// class DeleteMailMessageRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteMailMessageResponse extends EmptyPositiveResponse {}

// class DownloadMailMessageRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         format: { type: "string" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadMailMessageResponse extends PositiveFileResponse {}

// class DownloadMailMessageAttachmentRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         message_id: { type: "integer" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadMailMessageAttachmentResponse extends PositiveFileResponse {}

// class GetCountersRequest extends Request {}
// class GetCountersResponse extends Response {
//   get schema() {
//     return CounterList;
//   }
// }

// class AddCounterRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         name: { type: "string" },
//         description: { type: "string" },
//         value: { type: "integer" },
//         increment: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class AddCounterResponse extends Response {
//   get schema() {
//     return CounterSingle;
//   }
// }

// class UpdateCounterRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//         name: { type: "string" },
//         description: { type: "string" },
//         value: { type: "integer" },
//         increment: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class UpdateCounterResponse extends Response {
//   get schema() {
//     return CounterSingle;
//   }
// }

// class DeleteCounterRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         id: { type: "integer" },
//       },
//       additionalProperties: false,
//     };
//   }
// }
// class DeleteCounterResponse extends EmptyPositiveResponse {}

// class DownloadTransmittalCoverSheetRequest extends Request {
//   get schema() {
//     return {
//       type: "object",
//       properties: {
//         folder_id: { type: "integer" },
//         usergroup_id: { type: "integer" },
//         document_ids: { type: "array", items: { type: "string" } },
//         template: { type: "string" },
//       },
//       additionalProperties: true, // set_size_method
//     };
//   }
// }
// class DownloadTransmittalCoverSheetResponse extends PositiveFileResponse {}

class AbstractApi {
  constructor() {
    this._auth_token = null;
  }

  set_auth_token(token) {
    this._auth_token = token;
  }

  call = (request) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.REQUEST_HANDLERS,
        request.constructor.name
      )
    ) {
      throw new NotImplementedError(
        "API request does not have handler for " + request.constructor.name
      );
    }

    const func = this.REQUEST_HANDLERS[request.constructor.name];
    return func(request);
  };

  login_with_credentials = () => {
    throw new NotImplementedError();
  };

  my_credentials = () => {
    throw new NotImplementedError();
  };

  refresh_tokens = () => {
    throw new NotImplementedError();
  };

  // login_with_token = () => {
  //   throw new NotImplementedError();
  // };

  // get_info = () => {
  //   throw new NotImplementedError();
  // };

  // get_users = () => {
  //   throw new NotImplementedError();
  // };

  // set_user = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_replacements = () => {
  //   throw new NotImplementedError();
  // };

  // add_user_replacement = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user_replacement = () => {
  //   throw new NotImplementedError();
  // };

  // get_on_behalf_users = () => {
  //   throw new NotImplementedError();
  // };

  // set_on_behalf_user = () => {
  //   throw new NotImplementedError();
  // };

  // delete_on_behalf_user = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_groups = () => {
  //   throw new NotImplementedError();
  // };

  // set_user_groups = () => {
  //   throw new NotImplementedError();
  // };

  // add_user_groups = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user_groups = () => {
  //   throw new NotImplementedError();
  // };

  // add_user_to_user_group = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user_from_user_group = () => {
  //   throw new NotImplementedError();
  // };

  // get_folders = () => {
  //   throw new NotImplementedError();
  // };

  // add_folder = () => {
  //   throw new NotImplementedError();
  // };

  // update_folder = () => {
  //   throw new NotImplementedError();
  // };

  // delete_folder = () => {
  //   throw new NotImplementedError();
  // };

  // get_document = () => {
  //   throw new NotImplementedError();
  // };

  // get_previous_documents = () => {
  //   throw new NotImplementedError();
  // };

  // get_many_documents = () => {
  //   throw new NotImplementedError();
  // };

  // get_waiting_document_approvals = () => {
  //   throw new NotImplementedError();
  // };

  // upload_file_to_folder = () => {
  //   throw new NotImplementedError();
  // };

  // download_file_from_folder = () => {
  //   throw new NotImplementedError();
  // };

  // download_many_documents_files_as_archive = () => {
  //   throw new NotImplementedError();
  // };

  // download_document_files_as_archive = () => {
  //   throw new NotImplementedError();
  // };

  // delete_file_from_folder = () => {
  //   throw new NotImplementedError();
  // };

  // update_file_from_folder = () => {
  //   throw new NotImplementedError();
  // };

  // get_roles = () => {
  //   throw new NotImplementedError();
  // };

  // add_role = () => {
  //   throw new NotImplementedError();
  // };

  // delete_role = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_folder_settings = () => {
  //   throw new NotImplementedError();
  // };

  // add_user_folder_settings = () => {
  //   throw new NotImplementedError();
  // };

  // set_user_folder_settings = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user_folder_settings = () => {
  //   throw new NotImplementedError();
  // };

  // get_permissions = () => {
  //   throw new NotImplementedError();
  // };

  // add_permission = () => {
  //   throw new NotImplementedError();
  // };

  // delete_permission = () => {
  //   throw new NotImplementedError();
  // };

  // get_permissions_by_roles = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_permissions = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_permissions_for_folder = () => {
  //   throw new NotImplementedError();
  // };

  // get_user_search_schema = () => {
  //   throw new NotImplementedError();
  // };

  // set_user_search_schema = () => {
  //   throw new NotImplementedError();
  // };

  // delete_user_search_schema = () => {
  //   throw new NotImplementedError();
  // };

  // get_spare_files = () => {
  //   throw new NotImplementedError();
  // };

  // save_document = () => {
  //   throw new NotImplementedError();
  // };

  // save_many_documents = () => {
  //   throw new NotImplementedError();
  // };

  // delete_document = () => {
  //   throw new NotImplementedError();
  // };

  // delete_many_documents = () => {
  //   throw new NotImplementedError();
  // };

  // duplicate_document_to_usergroup = () => {
  //   throw new NotImplementedError();
  // };

  // duplicate_many_documents_to_usergroup = () => {
  //   throw new NotImplementedError();
  // };

  // push_document_button = () => {
  //   throw new NotImplementedError();
  // };

  // get_upload_progress = () => {
  //   throw new NotImplementedError();
  // };

  // get_pdf_merge_files = () => {
  //   throw new NotImplementedError();
  // };

  // upload_pdf_merge_file = () => {
  //   throw new NotImplementedError();
  // };

  // update_pdf_merge_file = () => {
  //   throw new NotImplementedError();
  // };

  // delete_pdf_merge_file = () => {
  //   throw new NotImplementedError();
  // };

  // download_pdf_merge_result = () => {
  //   throw new NotImplementedError();
  // };

  // download_pdf_mix_result = () => {
  //   throw new NotImplementedError();
  // };

  // get_share_files = () => {
  //   throw new NotImplementedError();
  // };

  // upload_share_file = () => {
  //   throw new NotImplementedError();
  // };

  // download_share_file = () => {
  //   throw new NotImplementedError();
  // };

  // delete_share_file = () => {
  //   throw new NotImplementedError();
  // };

  // get_flows = () => {
  //   throw new NotImplementedError();
  // };

  // add_flow = () => {
  //   throw new NotImplementedError();
  // };

  // update_flow = () => {
  //   throw new NotImplementedError();
  // };

  // delete_flow = () => {
  //   throw new NotImplementedError();
  // };

  // get_flow_item = () => {
  //   throw new NotImplementedError();
  // };

  // restart_flow_item = () => {
  //   throw new NotImplementedError();
  // };

  // get_many_flow_items = () => {
  //   throw new NotImplementedError();
  // };

  // get_flow_item_steps = () => {
  //   throw new NotImplementedError();
  // };

  // get_many_documents_approvals = () => {
  //   throw new NotImplementedError();
  // };

  // get_document_approvals = () => {
  //   throw new NotImplementedError();
  // };

  // add_document_approval = () => {
  //   throw new NotImplementedError();
  // };

  // update_document_approval = () => {
  //   throw new NotImplementedError();
  // };

  // delete_document_approval = () => {
  //   throw new NotImplementedError();
  // };

  // get_document_approval_spare_files = () => {
  //   throw new NotImplementedError();
  // };

  // upload_document_approval_file = () => {
  //   throw new NotImplementedError();
  // };

  // delete_document_approval_file = () => {
  //   throw new NotImplementedError();
  // };

  // delegate_document_approval_file = () => {
  //   throw new NotImplementedError();
  // };

  // empty_cart = () => {
  //   throw new NotImplementedError();
  // };

  // get_cart_documents = () => {
  //   throw new NotImplementedError();
  // };

  // add_document_to_cart = () => {
  //   throw new NotImplementedError();
  // };

  // add_many_documents_to_cart = () => {
  //   throw new NotImplementedError();
  // };

  // remove_document_from_cart = () => {
  //   throw new NotImplementedError();
  // };

  // get_document_approval_flow = () => {
  //   throw new NotImplementedError();
  // };

  // set_document_approval_flow = () => {
  //   throw new NotImplementedError();
  // };

  // start_document_approval_flow = () => {
  //   throw new NotImplementedError();
  // };

  // stop_document_approval_flow = () => {
  //   throw new NotImplementedError();
  // };

  // get_server_settings = () => {
  //   throw new NotImplementedError();
  // };

  // update_server_setting = () => {
  //   throw new NotImplementedError();
  // };

  // get_mailboxes = () => {
  //   throw new NotImplementedError();
  // };

  // add_mailbox = () => {
  //   throw new NotImplementedError();
  // };

  // update_mailbox = () => {
  //   throw new NotImplementedError();
  // };

  // delete_mailbox = () => {
  //   throw new NotImplementedError();
  // };

  // get_mail_channels = () => {
  //   throw new NotImplementedError();
  // };

  // add_mail_channel = () => {
  //   throw new NotImplementedError();
  // };

  // update_mail_channel = () => {
  //   throw new NotImplementedError();
  // };

  // delete_mail_channel = () => {
  //   throw new NotImplementedError();
  // };

  // add_mail_channel_to_mailbox = () => {
  //   throw new NotImplementedError();
  // };

  // delete_mail_channel_from_mailbox = () => {
  //   throw new NotImplementedError();
  // };

  // fetch_mail_channel = () => {
  //   throw new NotImplementedError();
  // };

  // get_mail_messages = () => {
  //   throw new NotImplementedError();
  // };

  // delete_mail_message = () => {
  //   throw new NotImplementedError();
  // };

  // download_mail_message = () => {
  //   throw new NotImplementedError();
  // };

  // download_mail_message_attachment = () => {
  //   throw new NotImplementedError();
  // };

  // add_counter = () => {
  //   throw new NotImplementedError();
  // };

  // update_counter = () => {
  //   throw new NotImplementedError();
  // };

  // delete_counter = () => {
  //   throw new NotImplementedError();
  // };

  // download_transmittal_cover_sheet = () => {
  //   throw new NotImplementedError();
  // }
}

export {
  AbstractApi,
  NegativeResponse,
  // // INFO
  // GetInfoRequest,
  // GetInfoResponse,
  // LOGIN
  LoginCredentialsRequest,
  LoginCredentialsResponse,
  MyCredentialsRequest,
  MyCredentialsResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  // LoginTokenRequest,
  // LoginTokenResponse,
  // // USER
  // GetUsersRequest,
  // GetUsersResponse,
  // SetUserRequest,
  // SetUserResponse,
  // DeleteUserRequest,
  // DeleteUserResponse,
  // GetUserReplacementsRequest,
  // GetUserReplacementsResponse,
  // AddUserReplacementRequest,
  // AddUserReplacementResponse,
  // DeleteUserReplacementRequest,
  // DeleteUserReplacementResponse,
  // GetUserReplacementsOfUserRequest,
  // GetUserReplacementsOfUserResponse,
  // AddUserReplacementToUserRequest,
  // AddUserReplacementToUserResponse,
  // DeleteUserReplacementFromUserRequest,
  // DeleteUserReplacementFromUserResponse,
  // GetOnBehalfUsersRequest,
  // GetOnBehalfUsersResponse,
  // SetOnBehalfUserRequest,
  // SetOnBehalfUserResponse,
  // DeleteOnBehalfUserRequest,
  // DeleteOnBehalfUserResponse,
  // // USER GROUPS
  // GetUserGroupsRequest,
  // GetUserGroupsResponse,
  // AddUserGroupRequest,
  // AddUserGroupResponse,
  // SetUserGroupRequest,
  // SetUserGroupResponse,
  // DeleteUserGroupRequest,
  // DeleteUserGroupResponse,
  // AddUserToUserGroupRequest,
  // AddUserToUserGroupResponse,
  // DeleteUserFromUserGroupRequest,
  // DeleteUserFromUserGroupResponse,
  // // FOLDER
  // GetFoldersRequest,
  // GetFoldersResponse,
  // AddFolderRequest,
  // AddFolderResponse,
  // DeleteFolderRequest,
  // DeleteFolderResponse,
  // UpdateFolderRequest,
  // UpdateFolderResponse,
  // // DOCUMENT
  // GetDocumentRequest,
  // GetDocumentResponse,
  // GetManyDocumentsRequest,
  // GetManyDocumentsResponse,
  // GetWaitingDocumentApprovalsRequest,
  // GetWaitingDocumentApprovalsResponse,
  // SaveManyDocumentsRequest,
  // SaveManyDocumentsResponse,
  // DeleteManyDocumentsRequest,
  // DeleteManyDocumentsResponse,
  // DuplicateDocumentToUsergroupRequest,
  // DuplicateDocumentToUsergroupResponse,
  // DuplicateManyDocumentsToUsergroupRequest,
  // DuplicateManyDocumentsToUsergroupResponse,
  // GetPreviousDocumentsRequest,
  // GetPreviousDocumentsResponse,
  // PushDocumentButtonRequest,
  // PushDocumentButtonResponse,
  // // TRANSMITTAL
  // DownloadTransmittalCoverSheetRequest,
  // DownloadTransmittalCoverSheetResponse,
  // // DOCUMENT APPROVAL
  // GetManyDocumentsApprovalsRequest,
  // GetManyDocumentsApprovalsResponse,
  // GetDocumentApprovalsRequest,
  // GetDocumentApprovalsResponse,
  // AddDocumentApprovalRequest,
  // AddDocumentApprovalResponse,
  // UpdateDocumentApprovalRequest,
  // UpdateDocumentApprovalResponse,
  // DeleteDocumentApprovalRequest,
  // DeleteDocumentApprovalResponse,
  // DelegateDocumentApprovalRequest,
  // DelegateDocumentApprovalResponse,
  // GetDocumentApprovalSpareFilesRequest,
  // GetDocumentApprovalSpareFilesResponse,
  // UploadDocumentApprovalFileRequest,
  // UploadDocumentApprovalFileResponse,
  // DeleteDocumentApprovalFileRequest,
  // DeleteDocumentApprovalFileResponse,
  // // DOCUMENT APPROVAL FLOW
  // GetDocumentApprovalFlowRequest,
  // GetDocumentApprovalFlowResponse,
  // SetDocumentApprovalFlowRequest,
  // SetDocumentApprovalFlowResponse,
  // StartDocumentApprovalFlowRequest,
  // StartDocumentApprovalFlowResponse,
  // StopDocumentApprovalFlowRequest,
  // StopDocumentApprovalFlowResponse,
  // // CART
  // EmptyCartRequest,
  // EmptyCartResponse,
  // GetCartDocumentsRequest,
  // GetCartDocumentsResponse,
  // AddDocumentToCartRequest,
  // AddDocumentToCartResponse,
  // AddManyDocumentsToCartRequest,
  // AddManyDocumentsToCartResponse,
  // RemoveDocumentFromCartRequest,
  // RemoveDocumentFromCartResponse,
  // // FILE
  // UploadFileToFolderRequest,
  // UploadFileToFolderResponse,
  // DownloadFileFromFolderRequest,
  // DownloadFileFromFolderResponse,
  // DownloadManyDocumentsFilesAsArchiveRequest,
  // DownloadManyDocumentsFilesAsArchiveResponse,
  // DownloadDocumentFilesAsArchiveRequest,
  // DownloadDocumentFilesAsArchiveResponse,
  // DeleteFileFromFolderRequest,
  // DeleteFileFromFolderResponse,
  // UpdateFileFromFolderRequest,
  // UpdateFileFromFolderResponse,
  // GetFileInfoRequest,
  // GetFileInfoResponse,
  // GetSpareFilesRequest,
  // GetSpareFilesResponse,
  // GetUploadProgressRequest,
  // GetUploadProgressResponse,
  // // ROLE
  // GetRolesRequest,
  // GetRolesResponse,
  // AddRoleRequest,
  // AddRoleResponse,
  // DeleteRoleRequest,
  // DeleteRoleResponse,
  // // USER FOLDER SETTING
  // GetUserFolderSettingsRequest,
  // GetUserFolderSettingsResponse,
  // AddUserFolderSettingsRequest,
  // AddUserFolderSettingsResponse,
  // UpdateUserFolderSettingsRequest,
  // UpdateUserFolderSettingsResponse,
  // DeleteUserFolderSettingsRequest,
  // DeleteUserFolderSettingsResponse,
  // // PERMISSION
  // GetPermissionsRequest,
  // GetPermissionsResponse,
  // AddPermissionRequest,
  // AddPermissionResponse,
  // DeletePermissionRequest,
  // DeletePermissionResponse,
  // GetUserPermissionsRequest,
  // GetUserPermissionsResponse,
  // GetUserPermissionsForFolderRequest,
  // GetUserPermissionsForFolderResponse,
  // // USER SEARCH SCHEMA
  // GetUserSearchSchemaRequest,
  // GetUserSearchSchemaResponse,
  // SetUserSearchSchemaRequest,
  // SetUserSearchSchemaResponse,
  // DeleteUserSearchSchemaRequest,
  // DeleteUserSearchSchemaResponse,
  // // SERVER SETTINGS
  // GetServerSettingsRequest,
  // GetServerSettingsResponse,
  // UpdateServerSettingRequest,
  // UpdateServerSettingResponse,
  // // MAILBOXES
  // GetMailBoxesRequest,
  // GetMailBoxesResponse,
  // AddMailBoxRequest,
  // AddMailBoxResponse,
  // UpdateMailBoxRequest,
  // UpdateMailBoxResponse,
  // DeleteMailBoxRequest,
  // DeleteMailBoxResponse,
  // // MAIL CHANNELS
  // GetMailChannelsRequest,
  // GetMailChannelsResponse,
  // AddMailChannelRequest,
  // AddMailChannelResponse,
  // UpdateMailChannelRequest,
  // UpdateMailChannelResponse,
  // DeleteMailChannelRequest,
  // DeleteMailChannelResponse,
  // AddMailChannelToMailBoxRequest,
  // AddMailChannelToMailBoxResponse,
  // DeleteMailChannelFromMailBoxRequest,
  // DeleteMailChannelFromMailBoxResponse,
  // FetchMailChannelRequest,
  // FetchMailChannelResponse,
  // // MAIL MESSAGES
  // GetMailMessagesRequest,
  // GetMailMessagesResponse,
  // DeleteMailMessageRequest,
  // DeleteMailMessageResponse,
  // DownloadMailMessageRequest,
  // DownloadMailMessageResponse,
  // DownloadMailMessageAttachmentRequest,
  // DownloadMailMessageAttachmentResponse,
  // // SERVICE - PDF MERGE
  // GetPdfMergeFilesRequest,
  // GetPdfMergeFilesResponse,
  // UploadPdfMergeFileRequest,
  // UploadPdfMergeFileResponse,
  // UpdatePdfMergeFileRequest,
  // UpdatePdfMergeFileResponse,
  // DeletePdfMergeFileRequest,
  // DeletePdfMergeFileResponse,
  // DownloadPdfMergeResultRequest,
  // DownloadPdfMergeResultResponse,
  // DownloadPdfMixResultRequest,
  // DownloadPdfMixResultResponse,
  // // SERVICE - SHARE FILE
  // GetShareFilesRequest,
  // GetShareFilesResponse,
  // UploadShareFileRequest,
  // UploadShareFileResponse,
  // DownloadShareFileRequest,
  // DownloadShareFileResponse,
  // DeleteShareFileRequest,
  // DeleteShareFileResponse,
  // // SERVICE - COUNTER
  // GetCountersRequest,
  // GetCountersResponse,
  // AddCounterRequest,
  // AddCounterResponse,
  // UpdateCounterRequest,
  // UpdateCounterResponse,
  // DeleteCounterRequest,
  // DeleteCounterResponse,
  // // WORKFLOW - FLOW
  // GetFlowsRequest,
  // GetFlowsResponse,
  // AddFlowRequest,
  // AddFlowResponse,
  // UpdateFlowRequest,
  // UpdateFlowResponse,
  // DeleteFlowRequest,
  // DeleteFlowResponse,
  // // WORKFLOW - FLOW ITEM
  // GetFlowItemRequest,
  // GetFlowItemResponse,
  // RestartFlowItemRequest,
  // RestartFlowItemResponse,
  // GetManyFlowItemsRequest,
  // GetManyFlowItemsResponse,
  // GetFlowItemStepsRequest,
  // GetFlowItemStepsResponse,
};
