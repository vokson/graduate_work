// import { v4 as uuidv4 } from "uuid";

class User {
  constructor(
    username,
    email,
    first_name,
    last_name,
    is_superuser,
    permissions
  ) {
    this._username = username;
    this._email = email;
    this._first_name = first_name;
    this._last_name = last_name;
    this._is_superuser = is_superuser;
    this._permissions = permissions;
  }

  reset() {
    this._username = "";
    this._email = "";
    this._first_name = "";
    this._last_name = "";
    this._is_superuser = false
    this._permissions = []
  }

  // get to_dict() {
  //   return {
  //     username: this._username,
  //     email: this._email,
  //     first_name: this._first_name,
  //     last_name: this._last_name,
  //     patronomic: this._patronomic,
  //     position: this._position,
  //     department: this._department,
  //     is_active: this._is_active,
  //     access_group_regex: this._access_group_regex,
  //     role: this._role,
  //     role_inside_group: this._role_inside_group,
  //     role_outside_group: this._role_outside_group,
  //     on_behalf: this._on_behalf,
  //   };
  // }

  get username() {
    return this._username;
  }

  // set username(value) {
  //   this._username = value;
  // }

  get email() {
    return this._email;
  }

  // set email(value) {
  //   this._email = value;
  // }

  get first_name() {
    return this._first_name;
  }

  // set first_name(value) {
  //   this._first_name = value;
  // }

  get last_name() {
    return this._last_name;
  }

  // set last_name(value) {
  //   this._last_name = value;
  // }

  get is_superuser() {
    return this._is_superuser;
  }

  get permissions() {
    return this._permissions;
  }
}

class CdnServer {
  constructor(
    id,
    name,
    host,
    port,
    location,
    zone,
    latitude,
    longitude,
    is_on,
    is_active,
    created,
    updated
  ) {
    this._id = id;
    this._name = name;
    this._host = host;
    this._port = port;
    this._location = location;
    this._zone = zone;
    this._latitude = latitude;
    this._longitude = longitude;
    this._is_on = is_on;
    this._is_active = is_active;
    this._created = created;
    this._updated = updated;
  }

  get to_dict() {
    return {
      id: this._id,
      name: this._name,
      host: this._host,
      port: this._port,
      location: this._location,
      zone: this._zone,
      latitude: this._latitude,
      longitude: this._longitude,
      is_on: this._is_on,
      is_active: this._is_active,
      created: this._created,
      updated: this._updated,
    };
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get host() {
    return this._host;
  }

  get port() {
    return this._port;
  }

  get location() {
    return this._location;
  }

  get zone() {
    return this._zone;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  get is_on() {
    return this._is_on;
  }

  get is_active() {
    return this._is_active;
  }

  get created() {
    return this._created;
  }

  get updated() {
    return this._updated;
  }

}

class UserAction {
  constructor(
    id,
    event,
    data,
    created,
  ) {
    this._id = id;
    this._event = event;
    this._data = data;
    this._created = created;
  }

  get id() {
    return this._id;
  }

  get created() {
    return this._created;
  }

  get text() {
    if (this._event === 'FILE.UPLOADED') return this._file_uploaded_text;
    if (this._event === 'FILE.DOWNLOADED') return this._file_downloaded_text;
    if (this._event === 'FILE.RENAMED') return this._file_renamed_text;
    if (this._event === 'FILE.DELETED') return this._file_deleted_text;
    if (this._event === 'FILE_SHARE_LINK.CREATED') return this._file_share_link_created_text;
    if (this._event === 'FILE_SHARE_LINK.DELETED') return this._file_share_link_deleted_text;
    return `Wrong event ${this._event}`;
  }

  get _file_uploaded_text() {
    return `Файл "${this._data['name']}" был добавлен`;
  }

  get _file_downloaded_text() {
    return `Файл "${this._data['name']}" был скачан`;
  }

  get _file_renamed_text() {
    return `Файл "${this._data['old_name']}" был переименован в "${this._data['new_name']}"`
  }

  get _file_deleted_text() {
    return `Файл "${this._data['name']}" был удален`;
  }

  get _file_share_link_created_text() {
    return `Создана общедоступная ссылка на файл "${this._data['name']}"`;
  }

  get _file_share_link_deleted_text() {
    return `Общедоступная ссылка на файл "${this._data['name']}", созданная ${new Date(this._data['created']).toLocaleString()}, была удалена`;
  }

}

class ShareLink {
  constructor(
    id,
    file,
    is_secured,
    expire_at,
    created,
  ) {
    this._id = id;
    this._file = file;
    this._is_secured = is_secured;
    this._expire_at = expire_at;
    this._created = created;
  }

  get id() {
    return this._id;
  }

  get file() {
    return this._file;
  }

  get is_secured() {
    return this._is_secured;
  }

  get expire_at() {
    return this._expire_at;
  }

  get is_expired() {
    if (this._expire_at === null || this._expire_at > Date.now()) return false;
    return true;
  }

  get created() {
    return this._created;
  }

  get text() {
    const expire_text = this._expire_at ? 'до ' + this._expire_at.toLocaleString() : 'бессрочно';
    return `${this._is_secured ? ', защищенная паролем' : ' без пароля'}. Действует ${expire_text}.`;
  }
}


class File {
  constructor(id, name, total_size, created, updated) {
    this._id = id;
    this._name = name;
    this._total_size = total_size;
    this._servers = [];
    this._created = created;
    this._updated = updated;
    this._uploaded_size = 0;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get size() {
    return this._total_size;
  }

  get servers() {
    return this._servers;
  }

  get names_of_servers() {
    return this._servers.map(x => x.name)
  }

  set servers(new_servers) {
    this._servers = new_servers
  }

  get created() {
    return this._created;
  }

  get updated() {
    return this._updated;
  }

  set_total_size(size) {
    this._total_size = size;
  }

  _formatBytes(bytes, decimals) {
    if (bytes == 0) return "0 Bytes";
    var k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  formatted_size(decimals) {
    return this._formatBytes(this._total_size, decimals);
  }

  get progress() {
    return Math.floor((this._uploaded_size / this._total_size) * 100);
  }

  get uploaded() {
    return this._uploaded_size >= this._total_size;
  }

  set_size_complete() {
    this._uploaded_size = this._total_size;
  }

  set_size(size) {
    // console.log(`Size = ${size} bytes`);
    if (size < 0) {
      this._uploaded_size = 0;
      return;
    }
    if (size > this._total_size) {
      this._uploaded_size = this._total_size;
      return;
    }

    // Always increase size
    if (size > this._uploaded_size) this._uploaded_size = size;
  }
}

export {
  User,
  CdnServer,
  File,
  ShareLink,
  UserAction
};
