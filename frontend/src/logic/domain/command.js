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

class AddCdnServer extends Command {
  constructor(name, host, port, location, zone, latitude, longitude, is_on, is_active) {
    super();
    this.name = name;
    this.host = host;
    this.port = port;
    this.location = location;
    this.zone = zone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.is_on = is_on;
    this.is_active = is_active;
  }
}

class UpdateCdnServer extends Command {
  constructor(id, name, host, port, location, zone, latitude, longitude, is_on, is_active) {
    super();
    this.id = id;
    this.name = name;
    this.host = host;
    this.port = port;
    this.location = location;
    this.zone = zone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.is_on = is_on;
    this.is_active = is_active;
  }
}

class DeleteCdnServer extends Command {
  constructor(id) {
    super();
    this.id = id;
  }
}


class GetUserActions extends Command {
  constructor(page_num, page_size) {
    super();
    this.page_num = page_num;
    this.page_size = page_size;
  }
}

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

class RenameFile extends Command {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }
}

class DownloadFile extends Command {
  constructor(id) {
    super();
    this.id = id;
  }
}

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
  constructor(link, name, size) {
    super();
    this.link = link;
    this.name = name;
    this.size = size;
  }
}

class AddFileShareLink extends Command {
  constructor(id, lifetime, password) {
    super();
    this.id = id;
    this.lifetime = lifetime;
    this.password = password;
  }
}

class GetFileShareLinks extends Command {
  constructor(file_id) {
    super();
    this.file_id = file_id;
  }
}

class FlushFileShareLinks extends Command { }

class GetFileShareLink extends Command {
  constructor(file_id, link_id) {
    super();
    this.file_id = file_id;
    this.link_id = link_id;
  }
}

class DeleteFileShareLink extends Command {
  constructor(file_id, link_id) {
    super();
    this.file_id = file_id;
    this.link_id = link_id;
  }
}

class DownloadFileByFileShareLink extends Command {
  constructor(file_id, link_id, password) {
    super();
    this.file_id = file_id;
    this.link_id = link_id;
    this.password = password;
  }
}

export {
  Command,
  Notify,
  NotifyApiError,
  // USER
  LoginWithCredentials,
  MyCredentials,
  RefreshTokens,
  Logout,
  GetUserActions,
  // CDN SERVERS
  GetCdnServers,
  AddCdnServer,
  UpdateCdnServer,
  DeleteCdnServer,
  // FILE
  GetFiles,
  GetFileServers,
  DeleteFile,
  RenameFile,
  UploadFile,
  UploadFileByLink,
  DownloadFile,
  DownloadFileByLink,
  // LINK
  AddFileShareLink,
  DeleteFileShareLink,
  GetFileShareLinks,
  FlushFileShareLinks,
  GetFileShareLink,
  DownloadFileByFileShareLink,
};
