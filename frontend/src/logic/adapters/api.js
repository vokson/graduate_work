import { DataClass } from "../domain/dataclass";
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
import {
  List as UserActionList
} from "./api_responses/models/user_action";

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

class PositiveFileResponse extends Response {
  get schema() {
    return {
      type: "object",
      properties: {
        file: { type: "object" },
      },
      additionalProperties: false,
    };
  }
}

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

class GetFileServersRequest extends Request {
  get schema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      additionalProperties: false,
    };
  }
}
class GetFileServersResponse extends Response {
  get schema() {
    return CdnServerList;
  }
}


class DeleteFileRequest extends Request {
  get schema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      additionalProperties: false,
    };
  }
}
class DeleteFileResponse extends EmptyPositiveResponse { }

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

class GetDownloadLinkRequest extends Request {
  get schema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      additionalProperties: false,
    };
  }
}
class GetDownloadLinkResponse extends Response {
  get schema() {
    return LinkSingle;
  }
}

class GetUserActionsRequest extends Request {}
class GetUserActionsResponse extends Response {
  get schema() {
    return UserActionList;
  }
}

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

class DownloadFileRequest extends Request {
  get schema() {
    return {
      type: "object",
      properties: {
        link: { type: "string" },
      },
      additionalProperties: true, // set_size_method
    };
  }
}
class DownloadFileResponse extends PositiveFileResponse {}

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

  get_user_actions = () => {
    throw new NotImplementedError();
  };

  get_files = () => {
    throw new NotImplementedError();
  };

  get_file_servers = () => {
    throw new NotImplementedError();
  };

  delete_file = () => {
    throw new NotImplementedError();
  };

  get_upload_link = () => {
    throw new NotImplementedError();
  };

  upload_file = () => {
    throw new NotImplementedError();
  };

  get_download_link = () => {
    throw new NotImplementedError();
  };

  download_file = () => {
    throw new NotImplementedError();
  };

}

export {
  AbstractApi,
  NegativeResponse,

  // USER
  LoginCredentialsRequest,
  LoginCredentialsResponse,
  LogoutRequest,
  LogoutResponse,
  MyCredentialsRequest,
  MyCredentialsResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  GetUserActionsRequest,
  GetUserActionsResponse,

  // CDN SERVER
  GetCdnServersRequest,
  GetCdnServersResponse,

  // FILE
  GetFilesRequest,
  GetFilesResponse,
  GetFileServersRequest,
  GetFileServersResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  GetUploadLinkRequest,
  GetUploadLinkResponse,
  GetDownloadLinkRequest,
  GetDownloadLinkResponse,
  UploadFileRequest,
  UploadFileResponse,
  DownloadFileRequest,
  DownloadFileResponse,
};
