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

class BaseFile {
  constructor(id, name, total_size) {
    this._id = id;
    this._name = name;
    this._uploaded_size = 0;
    this._total_size = total_size;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  rename(name) {
    this._name = name;
  }

  get size() {
    return this._total_size;
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
  BaseFile,
};