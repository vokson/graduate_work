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
  GetUserActionsResponse,

  // CDN SERVER
  GetCdnServersResponse,
  AddCdnServerResponse,
  UpdateCdnServerResponse,
  DeleteCdnServerResponse,

  // FILE
  GetFilesResponse,
  GetFileServersResponse,
  DeleteFileResponse,
  RenameFileResponse,
  GetUploadLinkResponse,
  UploadFileResponse,
  GetDownloadLinkResponse,
  DownloadFileResponse,

  // SHARE LINK
  AddFileShareLinkResponse,
  GetFileShareLinksResponse,
  GetFileShareLinkResponse,
  DeleteFileShareLinkResponse,
  GetDownloadLinkByFileShareLinkResponse
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
      GetUserActionsRequest: this.get_user_actions,

      // CDN SERVER
      GetCdnServersRequest: this.get_cdn_servers,
      AddCdnServerRequest: this.add_cdn_server,
      UpdateCdnServerRequest: this.update_cdn_server,
      DeleteCdnServerRequest: this.delete_cdn_server,

      // FILE
      GetFilesRequest: this.get_files,
      GetFileServersRequest: this.get_file_servers,
      DeleteFileRequest: this.delete_file,
      RenameFileRequest: this.rename_file,
      GetUploadLinkRequest: this.get_upload_link,
      UploadFileRequest: this.upload_file,
      GetDownloadLinkRequest: this.get_download_link,
      DownloadFileRequest: this.download_file,


      // SHARE LINK
      AddFileShareLinkRequest: this.add_file_share_link,
      GetFileShareLinksRequest: this.get_file_share_links,
      GetFileShareLinkRequest: this.get_file_share_link,
      DeleteFileShareLinkRequest: this.delete_file_share_link,
      GetDownloadLinkByFileShareLinkRequest: this.get_download_link_by_file_share_link,
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


    const operation_by_link = path.startsWith('http')

    let url = null
    if (operation_by_link) {
      url = new URL(`${path}`)
    } else {
      url = new URL(`${this.api_url}${path}`);
      url.search = new URLSearchParams(parameters).toString();
    }

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
      if (this._auth_token && this._auth_token !== null && !operation_by_link) {
        xhr.setRequestHeader("Authorization", "Bearer " + this._auth_token);
      }

      if (set_download_size_method !== null)
        xhr.onprogress = (event) => set_download_size_method(event.loaded);

      if (set_upload_size_method !== null)
        xhr.upload.onprogress = (event) => set_upload_size_method(event.loaded);

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

    if (operation_by_link && response.content_length > 0) {
      return {
        file: response.data,
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
      if (!operation_by_link && response.status_code != 204)
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

  add_cdn_server = async (request) => {
    return await this.perform_request(
      AddCdnServerResponse,
      `/storage/api/v1/servers/`,
      {
        method: "post",
        data: JSON.stringify({
          name: request.data.name,
          host: request.data.host,
          port: request.data.port,
          location: request.data.location,
          zone: request.data.zone,
          latitude: request.data.latitude,
          longitude: request.data.longitude,
          is_on: request.data.is_on,
          is_active: request.data.is_active,
        }),
      }
    );
  };

  update_cdn_server = async (request) => {
    return await this.perform_request(
      UpdateCdnServerResponse,
      `/storage/api/v1/servers/${request.data.id}/`,
      {
        method: "put",
        data: JSON.stringify({
          name: request.data.name,
          host: request.data.host,
          port: request.data.port,
          location: request.data.location,
          zone: request.data.zone,
          latitude: request.data.latitude,
          longitude: request.data.longitude,
          is_on: request.data.is_on,
          is_active: request.data.is_active,
        }),
      }
    );
  };

  delete_cdn_server = async (request) => {
    return await this.perform_request(
      DeleteCdnServerResponse,
      `/storage/api/v1/servers/${request.data.id}/`,
      {
        method: "delete",
      }
    );
  };

  get_user_actions = async (request) => {
    return await this.perform_request(
      GetUserActionsResponse,
      `/storage/api/v1/actions/`,
      {
        method: "get",
        parameters: {
          page_num: request.data.page_num,
          page_size: request.data.page_size,
        },
      }
    );
  };

  get_files = async () => {
    return await this.perform_request(
      GetFilesResponse,
      `/storage/api/v1/files/`
    );
  };

  get_file_servers = async (request) => {
    return await this.perform_request(
      GetFileServersResponse,
      `/storage/api/v1/files/${request.data.id}/servers/`,
    );
  };

  delete_file = async (request) => {
    return await this.perform_request(
      DeleteFileResponse,
      `/storage/api/v1/files/${request.data.id}/`,
      {
        method: "delete",
      }
    );
  };

  rename_file = async (request) => {
    return await this.perform_request(
      RenameFileResponse,
      `/storage/api/v1/files/${request.data.id}/`,
      {
        method: "put",
        data: JSON.stringify({
          name: request.data.name,
        }),
      }
    );
  };

  get_upload_link = async (request) => {
    return await this.perform_request(
      GetUploadLinkResponse,
      `/storage/api/v1/files/upload/`,
      {
        method: "post",
        data: JSON.stringify({
          name: request.data.name,
          size: request.data.size,
        }),
      }
    );
  };

  get_download_link = async (request) => {
    return await this.perform_request(
      GetDownloadLinkResponse,
      `/storage/api/v1/files/${request.data.id}/`
    );
  };

  upload_file = async (request) => {
    return await this.perform_request(
      UploadFileResponse,
      request.data.link,
      {
        method: "put",
        content_type: null,
        data: request.data.original_file,
        set_upload_size_method: request.data.on_progress
      }
    );
  };

  download_file = async (request) => {
    return await this.perform_request(
      DownloadFileResponse,
      request.data.link,
      {
        response_type: "blob",
        set_download_size_method: request.data.set_size_method,
      }
    );
  };

  add_file_share_link = async (request) => {
    return await this.perform_request(
      AddFileShareLinkResponse,
      `/storage/api/v1/files/${request.data.id}/links/`,
      {
        method: "post",
        data: JSON.stringify({
          lifetime: request.data.lifetime,
          password: request.data.password,
        }),
      }
    );
  };

  get_file_share_links = async (request) => {
    return await this.perform_request(
      GetFileShareLinksResponse,
      `/storage/api/v1/files/${request.data.file_id}/links/`
    );
  };

  get_file_share_link = async (request) => {
    return await this.perform_request(
      GetFileShareLinkResponse,
      `/storage/api/v1/files/${request.data.file_id}/links/${request.data.link_id}/`,
    );
  };

  delete_file_share_link = async (request) => {
    return await this.perform_request(
      DeleteFileShareLinkResponse,
      `/storage/api/v1/files/${request.data.file_id}/links/${request.data.link_id}/`,
      {
        method: "delete",
      }
    );
  };

  get_download_link_by_file_share_link = async (request) => {
    return await this.perform_request(
      GetDownloadLinkByFileShareLinkResponse,
      `/storage/api/v1/files/${request.data.file_id}/links/${request.data.link_id}/`,
      {
        method: "post",
        data: JSON.stringify({
          password: request.data.password,
        }),
      }
    );
  };

}

export { HttpApi };
