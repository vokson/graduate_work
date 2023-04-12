class Event { }

class ApiError extends Event {
  constructor(code) {
    super();
    this.code = code;
  }
}

// class AccessPagePermissionCheckFail extends Event {}
class UserLoginSuccess extends Event { }
class AccessTokenOutdated extends Event { }
class RefreshTokenOutdated extends Event { }
class UserLogoutSuccess extends Event { }

class UploadFileError extends Event {
  constructor(filename) {
    super();
    this.filename = filename;
  }
}

class UploadEmptyFileError extends UploadFileError { }
class UploadFileTooBigError extends UploadFileError { }
class UploadFileSuccess extends Event { }
class DownloadFileSuccess extends Event { }
class RenameFileSuccess extends Event { }
class DeleteFileSuccess extends Event { }

class FileShareLinkCopied extends Event { }
class FileShareLinkDeleted extends Event { }

class CdnServerAdded extends Event { }
class CdnServerUpdated extends Event { }
class CdnServerDeleted extends Event { }

export {
  Event,
  ApiError,

  // LOGIN
  UserLoginSuccess,
  AccessTokenOutdated,
  RefreshTokenOutdated,
  UserLogoutSuccess,

  // FILE
  UploadFileError,
  UploadEmptyFileError,
  UploadFileTooBigError,
  UploadFileSuccess,
  DownloadFileSuccess,
  RenameFileSuccess,
  DeleteFileSuccess,

  // LINK
  FileShareLinkCopied,
  FileShareLinkDeleted,

  // CDN SERVER
  CdnServerAdded,
  CdnServerUpdated,
  CdnServerDeleted,
};
