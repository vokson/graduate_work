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

  // FILE
  GetFilesResponse,
  GetFileServersResponse,
  DeleteFileResponse,
  GetUploadLinkResponse,
  UploadFileResponse,
  GetDownloadLinkResponse,
  DownloadFileResponse,
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
      GetUserActionsRequest: this.get_user_actions,

      // FILE
      GetFilesRequest: this.get_files,
      GetFileServersRequest: this.get_file_servers,
      DeleteFileRequest: this.delete_file,
      GetUploadLinkRequest: this.get_upload_link,
      UploadFileRequest: this.upload_file,
      GetDownloadLinkRequest: this.get_download_link,
      DownloadFileRequest: this.download_file,
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
      console.log('FILE DOWNLOAD')
      return {
        file: response.data,
      };
    }


    // // Если получен файл для скачивания
    // if (response.content_type === "application/octet-stream") {
    //   // Достаем имя файла из Content-Disposition

    //   // Проверяем вариант для английского имени файла
    //   const regex_en = /filename\s*=\s*"(?<filename>.+)"/g;
    //   const match_en = regex_en.exec(response.content_disposition);

    //   // Проверяем вариант для русского имени файла
    //   const regex_ru = /filename\*=utf-8''(?<filename>.+)/g;
    //   const match_ru = regex_ru.exec(response.content_disposition);

    //   const match = match_en === null ? match_ru : match_en;
    //   // Заменяем управляющие последовательности с % на символы
    //   return {
    //     file: response.data,
    //     name: decodeURI(match.groups.filename)
    //       .replace(/%2C/g, ",")
    //       .replace(/%40/g, "@")
    //       .replace(/%3F/g, "?"),
    //     size: response.content_length,
    //   };
    // }

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

  get_user_actions = async () => {
    return await this.perform_request(
      GetUserActionsResponse,
      `/storage/api/v1/actions/`
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

}

export { HttpApi };
