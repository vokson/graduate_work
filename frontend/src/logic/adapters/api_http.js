/*eslint no-useless-escape: "error"*/

import libmime from "libmime";

import {
  AbstractApi,
  NegativeResponse,

  // USER
  LoginCredentialsResponse,
  MyCredentialsResponse,
  RefreshTokensResponse,
  LogoutResponse,

  // CDN SERVER
  GetCdnServersResponse,

  // FILE
  GetFilesResponse,
  UploadFileResponse,
} from "./api";

class HttpApiError extends Error { }

class HttpApi extends AbstractApi {
  constructor(api_url) {
    super();
    this.api_url = api_url;

    this.REQUEST_HANDLERS = {

      // USER
      LoginCredentialsRequest: this.login_with_credentials,
      LogoutRequest: this.logout,
      MyCredentialsRequest: this.my_credentials,
      RefreshTokensRequest: this.refresh_tokens,

      // CDN SERVER
      GetCdnServersRequest: this.get_cdn_servers,

      // FILE
      GetFilesRequest: this.get_files,
      UploadFileRequest: this.upload_file,
    };
  }

  async perform_request(
    positive_response_class,
    path,
    {
      method = "get",
      data = null,
      parameters = {},
      content_type = "application/json",
      response_type = "text",
      set_upload_size_method = null,
      set_download_size_method = null,
      headers = {},
    } = {}
  ) {
    try {
      const result = await this.http_call(
        path,
        method,
        content_type,
        data,
        parameters,
        response_type,
        set_upload_size_method,
        set_download_size_method,
        headers
      );
      return new positive_response_class(result);
    } catch (e) {
      console.log(e.message);
      if (e instanceof HttpApiError) {
        return new NegativeResponse({ code: e.message });
      }

      throw e;
    }
  }

  async http_call(
    path,
    method,
    content_type,
    data,
    parameters,
    response_type,
    set_upload_size_method,
    set_download_size_method,
    headers
  ) {
    let url = new URL(`${this.api_url}${path}`);
    url.search = new URLSearchParams(parameters).toString();

    let response = null;
    response = await new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.responseType = response_type;

      if (content_type !== null) {
        xhr.setRequestHeader("Content-Type", content_type);
      }

      // Устанавливаем заголовки, в том числе для отслеживания прогресса закачки на сервере
      if (Object.keys(headers).length !== 0) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      // Устанавливаем авторизационный токен
      if (this._auth_token && this._auth_token !== null) {
        xhr.setRequestHeader("Authorization", "Bearer " + this._auth_token);
      }

      if (set_download_size_method !== null)
        xhr.onprogress = (event) => set_download_size_method(event.loaded);

      // Если сервер недоступен
      xhr.onerror = function () {
        console.log("Server unavailable");
        reject(new HttpApiError("Api.Server.Unavailable"));
      };

      xhr.onload = function () {
        const content_type = xhr.getResponseHeader("Content-Type");
        const content_length = Number.parseInt(
          xhr.getResponseHeader("Content-Length")
        );
        const content_disposition =
          content_type === "application/octet-stream"
            ? libmime.decodeWords(xhr.getResponseHeader("Content-Disposition"))
            : null;

        resolve({
          status_code: xhr.status,
          content_type: content_type,
          content_length: content_length,
          content_disposition: content_disposition,
          data: xhr.response,
        });
      };

      // Отсылаем запрос
      data === null ? xhr.send() : xhr.send(data);
    });

    // Если получен файл для скачивания
    if (response.content_type === "application/octet-stream") {
      // Достаем имя файла из Content-Disposition

      // Проверяем вариант для английского имени файла
      const regex_en = /filename\s*=\s*"(?<filename>.+)"/g;
      const match_en = regex_en.exec(response.content_disposition);

      // Проверяем вариант для русского имени файла
      const regex_ru = /filename\*=utf-8''(?<filename>.+)/g;
      const match_ru = regex_ru.exec(response.content_disposition);

      const match = match_en === null ? match_ru : match_en;
      // Заменяем управляющие последовательности с % на символы
      return {
        file: response.data,
        name: decodeURI(match.groups.filename)
          .replace(/%2C/g, ",")
          .replace(/%40/g, "@")
          .replace(/%3F/g, "?"),
        size: response.content_length,
      };
    }

    // Если это не файл, то должен быть формат JSON
    let json_data = {};
    try {
      // Если JSON в формате Blob, то конвертируем в текст
      if (
        response.data instanceof Blob &&
        response.data.type === "application/json"
      ) {
        json_data = JSON.parse(await response.data.text());
      } else {
        // Если JSON в формате Текст, то читаем без конвертации
        json_data = JSON.parse(response.data);
      }

      // Если код ответа нормальный, но формат ответа не JSON
    } catch (err) {
      throw new HttpApiError("Api.Error.NotJson");
    }

    // Если код ответа не OK
    if (response.status_code < 200 || response.status_code >= 300) {
      throw new HttpApiError(json_data.error);
    }

    // Если код ответа нормальный, формат JSON, запрос успешен
    return json_data;
  }

  login_with_credentials = async (request) => {
    return await this.perform_request(
      LoginCredentialsResponse,
      `/users/api/v1/auth/login/`,
      {
        method: "post",
        data: JSON.stringify({
          username: request.data.username,
          password: request.data.password,
        }),
      }
    );
  };

  logout = async () => {
    return await this.perform_request(
      LogoutResponse,
      `/users/api/v1/auth/logout/`,
      {
        method: "post",
      }
    );
  };

  my_credentials = async () => {
    return await this.perform_request(MyCredentialsResponse, `/users/api/v1/users/me/`);
  };

  refresh_tokens = async () => {
    return await this.perform_request(
      RefreshTokensResponse,
      `/users/api/v1/auth/token/refresh/`,
      {
        method: "post",
      }
    );
  };

  get_cdn_servers = async () => {
    return await this.perform_request(
      GetCdnServersResponse,
      `/storage/api/v1/servers/`
    );
  };

  get_files = async () => {
    return await this.perform_request(
      GetFilesResponse,
      `/storage/api/v1/files/`
    );
  };

  //   login_with_token = async () => {
  //     return await this.perform_request(LoginTokenResponse, `/login/token/`);
  //   };

  // get_info = async () => {
  //   return await this.perform_request(GetInfoResponse, `/my/info/`);
  // };

  //   get_users = async () => {
  //     return await this.perform_request(GetUsersResponse, `/users/`);
  //   };

  //   set_user = async (request) => {
  //     return await this.perform_request(
  //       SetUserResponse,
  //       `/users/${request.data.username}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           is_active: request.data.is_active,
  //           access_group_regex: request.data.access_group_regex,
  //           role: request.data.role,
  //           role_inside_group: request.data.role_inside_group,
  //           role_outside_group: request.data.role_outside_group,
  //         }),
  //       }
  //     );
  //   };

  //   delete_user = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserResponse,
  //       `/users/${request.data.username}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_user_replacements = async () => {
  //     return await this.perform_request(
  //       GetUserReplacementsResponse,
  //       `/user-replacements/`
  //     );
  //   };

  //   add_user_replacement = async (request) => {
  //     return await this.perform_request(
  //       AddUserReplacementResponse,
  //       `/user-replacements/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           username: request.data.username,
  //         }),
  //       }
  //     );
  //   };

  //   delete_user_replacement = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserReplacementResponse,
  //       `/user-replacements/${request.data.username}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_user_replacements_of_user = async (request) => {
  //     return await this.perform_request(
  //       GetUserReplacementsOfUserResponse,
  //       `/users/${request.data.username}/replacements/`,
  //     );
  //   };

  //   add_user_replacement_to_user = async (request) => {
  //     return await this.perform_request(
  //       AddUserReplacementToUserResponse,
  //       `/users/${request.data.username_to_be_replaced}/replacements/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           username: request.data.replaced_with_username,
  //         }),
  //       }
  //     );
  //   };

  //   delete_user_replacement_from_user = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserReplacementFromUserResponse,
  //       `/users/${request.data.username_to_be_replaced}/replacements/${request.data.replaced_with_username}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_on_behalf_users = async () => {
  //     return await this.perform_request(GetOnBehalfUsersResponse, `/on-behalf/`);
  //   };

  //   set_on_behalf_user = async (request) => {
  //     return await this.perform_request(
  //       SetOnBehalfUserResponse,
  //       `/on-behalf/${request.data.username}/`,
  //       {
  //         method: "put",
  //       }
  //     );
  //   };

  //   delete_on_behalf_user = async (request) => {
  //     return await this.perform_request(
  //       DeleteOnBehalfUserResponse,
  //       `/on-behalf/${request.data.username}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_folders = async () => {
  //     return await this.perform_request(GetFoldersResponse, `/folders/`);
  //   };

  //   add_folder = async (request) => {
  //     return await this.perform_request(AddFolderResponse, `/folders/`, {
  //       method: "post",
  //       data: JSON.stringify({
  //         name: request.data.name,
  //         storage_path: request.data.storage_path,
  //         master_usergroup_slug: request.data.master_usergroup_slug,
  //         access_group: request.data.access_group,
  //         settings: request.data.settings,
  //       }),
  //     });
  //   };

  //   update_folder = async (request) => {
  //     return await this.perform_request(
  //       UpdateFolderResponse,
  //       `/folders/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           storage_path: request.data.storage_path,
  //           master_usergroup_slug: request.data.master_usergroup_slug,
  //           access_group: request.data.access_group,
  //           settings: request.data.settings,
  //         }),
  //       }
  //     );
  //   };

  //   delete_folder = async (request) => {
  //     return await this.perform_request(
  //       DeleteFolderResponse,
  //       `/folders/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_roles = async () => {
  //     return await this.perform_request(GetRolesResponse, `/roles/`);
  //   };

  //   // OK
  //   add_role = async (request) => {
  //     return await this.perform_request(AddRoleResponse, `/roles/`, {
  //       method: "post",
  //       data: JSON.stringify({ name: request.data.name }),
  //     });
  //   };

  //   delete_role = async (request) => {
  //     return await this.perform_request(
  //       DeleteRoleResponse,
  //       `/roles/${request.data.name}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   // OK
  //   get_user_folder_settings = async () => {
  //     return await this.perform_request(
  //       GetUserFolderSettingsResponse,
  //       `/user-folder-settings/`
  //     );
  //   };

  //   add_user_folder_settings = async (request) => {
  //     return await this.perform_request(
  //       AddUserFolderSettingsResponse,
  //       `/user-folder-settings/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           folder: request.data.folder_id,
  //           usergroup: request.data.usergroup_slug,
  //           user: request.data.username,
  //           role: request.data.role,
  //           search_schema: request.data.search_schema,
  //         }),
  //       }
  //     );
  //   };

  //   set_user_folder_settings = async (request) => {
  //     return await this.perform_request(
  //       UpdateUserFolderSettingsResponse,
  //       `/user-folder-settings/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           folder: request.data.folder_id,
  //           usergroup: request.data.usergroup_slug,
  //           user: request.data.username,
  //           role: request.data.role,
  //           search_schema: request.data.search_schema,
  //         }),
  //       }
  //     );
  //   };

  //   delete_user_folder_settings = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserFolderSettingsResponse,
  //       `/user-folder-settings/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_permissions = async () => {
  //     return await this.perform_request(GetPermissionsResponse, `/permissions/`);
  //   };

  //   add_permission = async (request) => {
  //     return await this.perform_request(
  //       AddPermissionResponse,
  //       `/roles/${request.data.role}/permissions/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           name: request.data.permission,
  //         }),
  //       }
  //     );
  //   };

  //   delete_permission = async (request) => {
  //     return await this.perform_request(
  //       DeletePermissionResponse,
  //       `/roles/${request.data.role}/permissions/${request.data.permission}/`,
  //       { method: "delete" }
  //     );
  //   };

  //   get_user_permissions = async () => {
  //     return await this.perform_request(
  //       GetUserPermissionsResponse,
  //       `/my/permissions/`
  //     );
  //   };

  //   get_user_permissions_for_folder = async (request) => {
  //     return await this.perform_request(
  //       GetUserPermissionsForFolderResponse,
  //       `/my/permissions/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/`
  //     );
  //   };

  //   get_user_search_schema = async (request) => {
  //     return await this.perform_request(
  //       GetUserSearchSchemaResponse,
  //       `/my/folder-search-schema/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/`
  //     );
  //   };

  //   set_user_search_schema = async (request) => {
  //     return await this.perform_request(
  //       SetUserSearchSchemaResponse,
  //       `/my/folder-search-schema/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({ search_schema: request.data.search_schema }),
  //       }
  //     );
  //   };

  //   delete_user_search_schema = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserSearchSchemaResponse,
  //       `/my/folder-search-schema/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/`,
  //       { method: "delete" }
  //     );
  //   };

  //   get_document = async (request) => {
  //     return await this.perform_request(
  //       GetDocumentResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/`
  //     );
  //   };

  //   get_previous_documents = async (request) => {
  //     return await this.perform_request(
  //       GetPreviousDocumentsResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/previous/${request.data.count}/`
  //     );
  //   };

  //   get_many_documents = async (request) => {
  //     const query_without_empty_fields = {};

  //     Object.keys(request.data.query).forEach((key) => {
  //       const value = request.data.query[key];
  //       if (value !== "") query_without_empty_fields[key] = value;
  //     });

  //     return await this.perform_request(
  //       GetManyDocumentsResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/`,
  //       {
  //         parameters: query_without_empty_fields,
  //       }
  //     );
  //   };

  //   get_waiting_document_approvals = async () => {
  //     return await this.perform_request(
  //       GetWaitingDocumentApprovalsResponse,
  //       "/documents/waiting-approvals/"
  //     );
  //   };

  //   push_document_button = async (request) => {
  //     return await this.perform_request(
  //       PushDocumentButtonResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/actions/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({ action: request.data.action}),
  //       }
  //     );
  //   };

  //   // OK
  //   save_many_documents = async (request) => {
  //     return await this.perform_request(
  //       SaveManyDocumentsResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify(request.data.docs),
  //       }
  //     );
  //   };

  //   duplicate_document_to_usergroup = async (request) => {
  //     return await this.perform_request(
  //       DuplicateDocumentToUsergroupResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.source_usergroup_id}/documents/${request.data.document_id}/copy_to_usergroup/${request.data.target_usergroup_id}/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({}),
  //       }
  //     );
  //   };

  //   duplicate_many_documents_to_usergroup = async (request) => {
  //     return await this.perform_request(
  //       DuplicateManyDocumentsToUsergroupResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.source_usergroup_id}/documents/copy_to_usergroup/${request.data.target_usergroup_id}/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify(request.data.document_ids),
  //       }
  //     );
  //   };

  //   // OK
  //   delete_many_documents = async (request) => {
  //     return await this.perform_request(
  //       DeleteManyDocumentsResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/`,
  //       {
  //         method: "delete",
  //         data: JSON.stringify(request.data.ids),
  //       }
  //     );
  //   };

    upload_file = async (request) => {
      const data = new FormData();
      data.append("id", request.data.id);
      data.append("file", request.data.original_file);

      return await this.perform_request(
        UploadFileResponse,
        `/storage/api/v1/files/`,
        {
          method: "post",
          content_type: null,
          data: data,
          headers: {
            "X-FILE-ID": request.data.id,
          },
        }
      );
    };

  //   download_file_from_folder = async (request) => {
  //     return await this.perform_request(
  //       DownloadFileFromFolderResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/files/${request.data.id}/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   download_many_documents_files_as_archive = async (request) => {
  //     return await this.perform_request(
  //       DownloadManyDocumentsFilesAsArchiveResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/download/archive/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           ids: request.data.document_ids,
  //         }),
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   download_document_files_as_archive = async (request) => {
  //     return await this.perform_request(
  //       DownloadDocumentFilesAsArchiveResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/download/archive/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   // OK
  //   get_spare_files = async (request) => {
  //     return await this.perform_request(
  //       GetSpareFilesResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/files/spare/`
  //     );
  //   };

  //   // OK
  //   delete_file_from_folder = async (request) => {
  //     return await this.perform_request(
  //       DeleteFileFromFolderResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/files/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   update_file_from_folder = async (request) => {
  //     return await this.perform_request(
  //       UpdateFileFromFolderResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/files/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //         }),
  //       }
  //     );
  //   };

  //   get_file_info = async (request) => {
  //     return await this.perform_request(
  //       GetFileInfoResponse,
  //       `/files/${request.data.id}/info/`
  //     );
  //   };

  //   get_upload_progress = async () => {
  //     return await this.perform_request(
  //       GetUploadProgressResponse,
  //       `/files/upload/progress/`
  //     );
  //   };

  //   get_pdf_merge_files = async () => {
  //     return await this.perform_request(
  //       GetPdfMergeFilesResponse,
  //       `/service/pdfmerge/files/`
  //     );
  //   };

  //   upload_pdf_merge_file = async (request) => {
  //     const data = new FormData();
  //     data.append("id", request.data.id);
  //     data.append("order", request.data.order);
  //     data.append("file", request.data.original_file);

  //     return await this.perform_request(
  //       UploadPdfMergeFileResponse,
  //       `/service/pdfmerge/files/`,
  //       {
  //         method: "post",
  //         content_type: null,
  //         data: data,
  //         headers: {
  //           "X-FILE-ID": request.data.id,
  //         },
  //       }
  //     );
  //   };

  //   update_pdf_merge_file = async (request) => {
  //     return await this.perform_request(
  //       UpdatePdfMergeFileResponse,
  //       `/service/pdfmerge/files/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           order: request.data.order,
  //           page_from: request.data.page_from,
  //           page_to: request.data.page_to,
  //           angle: request.data.angle,
  //         }),
  //       }
  //     );
  //   };

  //   delete_pdf_merge_file = async (request) => {
  //     return await this.perform_request(
  //       DeletePdfMergeFileResponse,
  //       `/service/pdfmerge/files/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   download_pdf_merge_result = async (request) => {
  //     return await this.perform_request(
  //       DownloadPdfMergeResultResponse,
  //       `/service/pdfmerge/merge/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //         parameters: {
  //           keep_bookmarks: request.data.keep_bookmarks,
  //           add_filenames_as_bookmarks: request.data.add_filenames_as_bookmarks,
  //         },
  //       }
  //     );
  //   };

  //   download_pdf_mix_result = async (request) => {
  //     return await this.perform_request(
  //       DownloadPdfMixResultResponse,
  //       `/service/pdfmerge/mix/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   get_user_groups = async () => {
  //     return await this.perform_request(GetUserGroupsResponse, `/usergroups/`);
  //   };

  //   // get_my_user_groups = async () => {
  //   //   return await this.perform_request(
  //   //     GetMyUserGroupsResponse,
  //   //     `/my/usergroups/`
  //   //   );
  //   // };

  //   add_user_group = async (request) => {
  //     return await this.perform_request(AddUserGroupResponse, `/usergroups/`, {
  //       method: "post",
  //       data: JSON.stringify({
  //         name: request.data.name,
  //         slug: request.data.slug,
  //         is_private: request.data.is_private,
  //       }),
  //     });
  //   };

  //   set_user_group = async (request) => {
  //     return await this.perform_request(
  //       SetUserGroupResponse,
  //       `/usergroups/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           slug: request.data.slug,
  //           is_private: request.data.is_private,
  //         }),
  //       }
  //     );
  //   };

  //   delete_user_group = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserGroupResponse,
  //       `/usergroups/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   add_user_to_user_group = async (request) => {
  //     return await this.perform_request(
  //       AddUserToUserGroupResponse,
  //       `/usergroups/${request.data.id}/users/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({ username: request.data.username }),
  //       }
  //     );
  //   };

  //   delete_user_from_user_group = async (request) => {
  //     return await this.perform_request(
  //       DeleteUserFromUserGroupResponse,
  //       `/usergroups/${request.data.id}/users/${request.data.username}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_share_files = async () => {
  //     return await this.perform_request(
  //       GetShareFilesResponse,
  //       `/service/share/files/`
  //     );
  //   };

  //   upload_share_file = async (request) => {
  //     const data = new FormData();
  //     data.append("id", request.data.id);
  //     data.append("file", request.data.original_file);

  //     return await this.perform_request(
  //       UploadShareFileResponse,
  //       `/service/share/files/`,
  //       {
  //         method: "post",
  //         content_type: null,
  //         data: data,
  //         headers: {
  //           "X-FILE-ID": request.data.id,
  //         },
  //       }
  //     );
  //   };

  //   delete_share_file = async (request) => {
  //     return await this.perform_request(
  //       DeleteShareFileResponse,
  //       `/service/share/files/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   download_share_file = async (request) => {
  //     return await this.perform_request(
  //       DownloadShareFileResponse,
  //       `/service/share/files/${request.data.id}/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   get_flows = async (request) => {
  //     const query_without_empty_fields = {};

  //     Object.keys(request.data.query).forEach((key) => {
  //       const value = request.data.query[key];
  //       if (value !== "") query_without_empty_fields[key] = value;
  //     });

  //     return await this.perform_request(GetFlowsResponse, `/workflow/flows/`, {
  //       parameters: query_without_empty_fields,
  //     });
  //   };

  //   add_flow = async (request) => {
  //     return await this.perform_request(AddFlowResponse, `/workflow/flows/`, {
  //       method: "post",
  //       data: JSON.stringify({
  //         name: request.data.name,
  //         trigger: request.data.trigger,
  //         is_active: request.data.is_active,
  //         is_multiple: request.data.is_multiple,
  //         message_if_fail: request.data.message_if_fail,
  //         process: request.data.process,
  //       }),
  //     });
  //   };

  //   update_flow = async (request) => {
  //     return await this.perform_request(
  //       UpdateFlowResponse,
  //       `/workflow/flows/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           trigger: request.data.trigger,
  //           is_active: request.data.is_active,
  //           is_multiple: request.data.is_multiple,
  //           message_if_fail: request.data.message_if_fail,
  //           process: request.data.process,
  //         }),
  //       }
  //     );
  //   };

  //   delete_flow = async (request) => {
  //     return await this.perform_request(
  //       DeleteFlowResponse,
  //       `/workflow/flows/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_flow_item = async (request) => {
  //     return await this.perform_request(
  //       GetFlowItemResponse,
  //       `/workflow/flowitems/${request.data.id}/`
  //     );
  //   };

  //   restart_flow_item = async (request) => {
  //     return await this.perform_request(
  //       RestartFlowItemResponse,
  //       `/workflow/flowitems/${request.data.id}/restart/`
  //     );
  //   };

  //   get_many_flow_items = async (request) => {
  //     const query_without_empty_fields = {};

  //     Object.keys(request.data.query).forEach((key) => {
  //       const value = request.data.query[key];
  //       if (value !== "") query_without_empty_fields[key] = value;
  //     });

  //     return await this.perform_request(
  //       GetManyFlowItemsResponse,
  //       `/workflow/flowitems/`,
  //       {
  //         parameters: query_without_empty_fields,
  //       }
  //     );
  //   };

  //   get_flow_item_steps = async (request) => {
  //     return await this.perform_request(
  //       GetFlowItemStepsResponse,
  //       `/workflow/flowitems/${request.data.flowitem_id}/steps/`
  //     );
  //   };

  //   get_many_documents_approvals = async (request) => {
  //     const query_without_empty_fields = {};

  //     Object.keys(request.data.query).forEach((key) => {
  //       const value = request.data.query[key];
  //       if (value !== "") query_without_empty_fields[key] = value;
  //     });

  //     return await this.perform_request(GetManyDocumentsApprovalsResponse, `/documents/approvals/`, {
  //       parameters: query_without_empty_fields,
  //     });
  //   };

  //   get_document_approvals = async (request) => {
  //     return await this.perform_request(
  //       GetDocumentApprovalsResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/`
  //     );
  //   };

  //   add_document_approval = async (request) => {
  //     return await this.perform_request(
  //       AddDocumentApprovalResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           username: request.data.username,
  //         }),
  //       }
  //     );
  //   };

  //   update_document_approval = async (request) => {
  //     return await this.perform_request(
  //       UpdateDocumentApprovalResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/${request.data.approval_id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           state: request.data.state,
  //           files: request.data.files,
  //           comments: request.data.comments,
  //         }),
  //       }
  //     );
  //   };

  //   delete_document_approval = async (request) => {
  //     return await this.perform_request(
  //       DeleteDocumentApprovalResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/${request.data.approval_id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   delegate_document_approval = async (request) => {
  //     return await this.perform_request(
  //       DelegateDocumentApprovalResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/${request.data.approval_id}/delegate/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           username: request.data.username,
  //           with_return: request.data.with_return,
  //         }),
  //       }
  //     );
  //   };

  //   get_document_approval_spare_files = async (request) => {
  //     return await this.perform_request(
  //       GetDocumentApprovalSpareFilesResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/files/spare/`
  //     );
  //   };

  //   upload_document_approval_file = async (request) => {
  //     const data = new FormData();
  //     data.append("id", request.data.file_id);
  //     data.append("file", request.data.original_file);

  //     return await this.perform_request(
  //       UploadDocumentApprovalFileResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/files/`,
  //       {
  //         method: "post",
  //         content_type: null,
  //         data: data,
  //         headers: {
  //           "X-FILE-ID": request.data.file_id,
  //         },
  //       }
  //     );
  //   };

  //   delete_document_approval_file = async (request) => {
  //     return await this.perform_request(
  //       DeleteDocumentApprovalFileResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approvals/files/${request.data.file_id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   empty_cart = async () => {
  //     return await this.perform_request(EmptyCartResponse, `/cart/empty/`, {
  //       method: "delete",
  //     });
  //   };

  //   get_cart_documents = async () => {
  //     return await this.perform_request(
  //       GetCartDocumentsResponse,
  //       `/cart/documents/`
  //     );
  //   };

  //   add_many_documents_to_cart = async (request) => {
  //     return await this.perform_request(
  //       AddManyDocumentsToCartResponse,
  //       `/cart/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           ids: request.data.document_ids,
  //         }),
  //       }
  //     );
  //   };

  //   add_document_to_cart = async (request) => {
  //     return await this.perform_request(
  //       AddDocumentToCartResponse,
  //       `/cart/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/`,
  //       { method: "post" }
  //     );
  //   };

  //   remove_document_from_cart = async (request) => {
  //     return await this.perform_request(
  //       RemoveDocumentFromCartResponse,
  //       `/cart/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/`,
  //       { method: "delete" }
  //     );
  //   };

  //   get_document_approval_flow = async (request) => {
  //     return await this.perform_request(
  //       GetDocumentApprovalFlowResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approval-flow/`
  //     );
  //   };

  //   set_document_approval_flow = async (request) => {
  //     return await this.perform_request(
  //       SetDocumentApprovalFlowResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approval-flow/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           steps: request.data.steps,
  //         }),
  //       }
  //     );
  //   };

  //   start_document_approval_flow = async (request) => {
  //     return await this.perform_request(
  //       StartDocumentApprovalFlowResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approval-flow/start/`,
  //       {
  //         method: "put",
  //       }
  //     );
  //   };

  //   stop_document_approval_flow = async (request) => {
  //     return await this.perform_request(
  //       StopDocumentApprovalFlowResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/documents/${request.data.document_id}/approval-flow/stop/`,
  //       {
  //         method: "put",
  //       }
  //     );
  //   };

  //   get_server_settings = async () => {
  //     return await this.perform_request(
  //       GetServerSettingsResponse,
  //       `/server-settings/`
  //     );
  //   };

  //   update_server_setting = async (request) => {
  //     return await this.perform_request(
  //       UpdateServerSettingResponse,
  //       `/server-settings/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           value: request.data.value,
  //         }),
  //       }
  //     );
  //   };

  //   get_mailboxes = async () => {
  //     return await this.perform_request(GetMailBoxesResponse, `/mail/boxes/`);
  //   };

  //   add_mailbox = async (request) => {
  //     return await this.perform_request(AddMailBoxResponse, `/mail/boxes/`, {
  //       method: "post",
  //       data: JSON.stringify({
  //         out_protocol: request.data.out_protocol,
  //         out_encryption: request.data.out_encryption,
  //         out_port: request.data.out_port,
  //         out_server: request.data.out_server,
  //         in_protocol: request.data.in_protocol,
  //         in_encryption: request.data.in_encryption,
  //         in_port: request.data.in_port,
  //         in_server: request.data.in_server,
  //         username: request.data.username,
  //         password: request.data.password,
  //         name: request.data.name,
  //       }),
  //     });
  //   };

  //   update_mailbox = async (request) => {
  //     return await this.perform_request(
  //       UpdateMailBoxResponse,
  //       `/mail/boxes/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           out_protocol: request.data.out_protocol,
  //           out_encryption: request.data.out_encryption,
  //           out_port: request.data.out_port,
  //           out_server: request.data.out_server,
  //           in_protocol: request.data.in_protocol,
  //           in_encryption: request.data.in_encryption,
  //           in_port: request.data.in_port,
  //           in_server: request.data.in_server,
  //           username: request.data.username,
  //           password: request.data.password,
  //           name: request.data.name,
  //         }),
  //       }
  //     );
  //   };

  //   delete_mailbox = async (request) => {
  //     return await this.perform_request(
  //       DeleteMailBoxResponse,
  //       `/mail/boxes/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   get_mail_channels = async () => {
  //     return await this.perform_request(
  //       GetMailChannelsResponse,
  //       `/mail/channels/`
  //     );
  //   };

  //   add_mail_channel = async (request) => {
  //     return await this.perform_request(
  //       AddMailChannelResponse,
  //       `/mail/channels/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           folder: request.data.folder,
  //           storage_path: request.data.storage_path,
  //           settings: request.data.settings,
  //           is_active: request.data.is_active,
  //         }),
  //       }
  //     );
  //   };

  //   update_mail_channel = async (request) => {
  //     return await this.perform_request(
  //       UpdateMailChannelResponse,
  //       `/mail/channels/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           folder: request.data.folder,
  //           storage_path: request.data.storage_path,
  //           settings: request.data.settings,
  //           is_active: request.data.is_active,
  //         }),
  //       }
  //     );
  //   };

  //   delete_mail_channel = async (request) => {
  //     return await this.perform_request(
  //       DeleteMailChannelResponse,
  //       `/mail/channels/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   add_mail_channel_to_mailbox = async (request) => {
  //     return await this.perform_request(
  //       AddMailChannelToMailBoxResponse,
  //       `/mail/boxes/${request.data.mailbox_id}/channels/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           id: request.data.mailchannel_id,
  //         }),
  //       }
  //     );
  //   };

  //   delete_mail_channel_from_mailbox = async (request) => {
  //     return await this.perform_request(
  //       DeleteMailChannelFromMailBoxResponse,
  //       `/mail/boxes/${request.data.mailbox_id}/channels/${request.data.mailchannel_id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   fetch_mail_channel = async (request) => {
  //     return await this.perform_request(
  //       FetchMailChannelResponse,
  //       `/mail/channels/${request.data.id}/fetch/`
  //     );
  //   };

  //   get_mail_messages = async (request) => {
  //     const query_without_empty_fields = {};

  //     Object.keys(request.data.query).forEach((key) => {
  //       const value = request.data.query[key];
  //       if (value !== "") query_without_empty_fields[key] = value;
  //     });

  //     return await this.perform_request(
  //       GetMailMessagesResponse,
  //       `/mail/messages/`,
  //       {
  //         parameters: query_without_empty_fields,
  //       }
  //     );
  //   };

  //   delete_mail_message = async (request) => {
  //     return await this.perform_request(
  //       DeleteMailMessageResponse,
  //       `/mail/messages/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   download_mail_message = async (request) => {
  //     return await this.perform_request(
  //       DownloadMailMessageResponse,
  //       `/mail/messages/${request.data.id}/${request.data.format}/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   download_mail_message_attachment = async (request) => {
  //     return await this.perform_request(
  //       DownloadMailMessageAttachmentResponse,
  //       `/mail/messages/${request.data.message_id}/attachments/${request.data.id}/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //       }
  //     );
  //   };

  //   get_counters = async () => {
  //     return await this.perform_request(
  //       GetCountersResponse,
  //       `/service/counters/`
  //     );
  //   };

  //   add_counter = async (request) => {
  //     return await this.perform_request(
  //       AddCounterResponse,
  //       `/service/counters/`,
  //       {
  //         method: "post",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           description: request.data.description,
  //           value: request.data.value,
  //           increment: request.data.increment,
  //         }),
  //       }
  //     );
  //   };

  //   update_counter = async (request) => {
  //     return await this.perform_request(
  //       UpdateCounterResponse,
  //       `/service/counters/${request.data.id}/`,
  //       {
  //         method: "put",
  //         data: JSON.stringify({
  //           name: request.data.name,
  //           description: request.data.description,
  //           value: request.data.value,
  //           increment: request.data.increment,
  //         }),
  //       }
  //     );
  //   };

  //   delete_counter = async (request) => {
  //     return await this.perform_request(
  //       DeleteCounterResponse,
  //       `/service/counters/${request.data.id}/`,
  //       {
  //         method: "delete",
  //       }
  //     );
  //   };

  //   download_transmittal_cover_sheet = async (request) => {
  //     return await this.perform_request(
  //       DownloadTransmittalCoverSheetResponse,
  //       `/folders/${request.data.folder_id}/usergroups/${request.data.usergroup_id}/transmittal_cover_sheets/`,
  //       {
  //         response_type: "blob",
  //         set_download_size_method: request.data.set_size_method,
  //         parameters: {
  //           template: request.data.template,
  //           document_ids: request.data.document_ids.join(','),
  //         },
  //       }
  //     );
  //   };
}

export { HttpApi };
