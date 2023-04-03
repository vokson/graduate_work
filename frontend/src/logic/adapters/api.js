import { DataClass } from "../domain/dataclass";
// import { Info } from "./api_responses/models/info";
import { Tokens } from "./api_responses/models/tokens";
import {
  Single as UserSingle
} from "./api_responses/models/user";
import {
  List as CdnServerList,
} from "./api_responses/models/cdn_server";
import {
  List as FileList,
} from "./api_responses/models/file";
import {
  Single as LinkSingle
} from "./api_responses/models/link";
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
class EmptyPositiveResponse extends Response {
  get schema() {
    return {
      type: "object",
      properties: {},
      additionalProperties: false,
    };
  }
}

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

class LogoutRequest extends Request { }
class LogoutResponse extends EmptyPositiveResponse { }

class MyCredentialsRequest extends Request { }
class MyCredentialsResponse extends Response {
  get schema() {
    return UserSingle;
  }
}

class RefreshTokensRequest extends Request { }
class RefreshTokensResponse extends Response {
  get schema() {
    return Tokens;
  }
}

class GetFilesRequest extends Request { }
class GetFilesResponse extends Response {
  get schema() {
    return FileList;
  }
}

class GetCdnServersRequest extends Request { }
class GetCdnServersResponse extends Response {
  get schema() {
    return CdnServerList;
  }
}

class GetUploadLinkRequest extends Request { 
  get schema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        size: { type: "integer" },
      },
      additionalProperties: false,
    };
  }
}
class GetUploadLinkResponse extends Response {
  get schema() {
    return LinkSingle;
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

class UploadFileRequest extends Request {
  // file = https://developer.mozilla.org/ru/docs/Web/API/File
  get schema() {
    return {
      type: "object",
      properties: {
        link: { type: "string" },
        original_file: { type: "object" },
      },
      additionalProperties: true, // progress_method
    };
  }
}
class UploadFileResponse extends EmptyPositiveResponse { }

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

  get_auth_token() {
    return this._auth_token;
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

  logout = () => {
    throw new NotImplementedError();
  };

  get_cdn_servers = () => {
    throw new NotImplementedError();
  };

  get_files = () => {
    throw new NotImplementedError();
  };

  upload_file = () => {
    throw new NotImplementedError();
  };

}

export {
  AbstractApi,
  NegativeResponse,

  // LOGIN
  LoginCredentialsRequest,
  LoginCredentialsResponse,
  LogoutRequest,
  LogoutResponse,
  MyCredentialsRequest,
  MyCredentialsResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,

  // CDN SERVER
  GetCdnServersRequest,
  GetCdnServersResponse,

  // FILE
  GetFilesRequest,
  GetFilesResponse,
  GetUploadLinkRequest,
  GetUploadLinkResponse,
  UploadFileRequest,
  UploadFileResponse,
};
