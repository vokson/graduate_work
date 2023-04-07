/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/

import { Command } from "../domain/command";
import { Event } from "../domain/event";
import {
  notify,
  notify_api_error,
  // get_info,
} from "./command_handlers/common_handlers";

import {
  login_with_credentials,
  my_credentials,
  refresh_tokens,
  // login_with_token,
  logout,
} from "./command_handlers/user_handlers";

// import {
//   get_permissions,
// } from "./command_handlers/permission_handlers";

import {
  get_cdn_servers,
  get_file_servers,
//   download_file_from_folder,
//   get_file_info,
//   delete_file_from_folder,
} from "./command_handlers/cdn_server_handlers";

import {
  get_files,
  delete_file,
  upload_file,
  upload_file_by_link,
  download_file,
  download_file_by_link,
//   download_file_from_folder,
//   get_file_info,
//   delete_file_from_folder,
} from "./command_handlers/file_handlers";


import {
  handle_api_error,
  // handle_access_perm_fail_error,
  upload_file_error,
  upload_file_success,
  delete_file_success,
  user_login_success,
  access_token_outdated,
  refresh_token_outdated,
  user_logout_success,
} from "./event_handlers";

const COMMAND_HANDLERS = {
  Notify: [notify],
  NotifyApiError: [notify_api_error],
  // GetInfo: [get_info],

  // USER
  LoginWithCredentials: [login_with_credentials],
  MyCredentials: [my_credentials],
  RefreshTokens: [refresh_tokens],
  // LoginWithToken: [login_with_token],
  Logout: [logout],

  // CDN SERVERS
  GetCdnServers: [get_cdn_servers],

  // FILE
  GetFiles: [get_files],
  GetFileServers: [get_file_servers],
  DeleteFile: [delete_file],
  UploadFile: [upload_file],
  UploadFileByLink: [upload_file_by_link],
  DownloadFile: [download_file],
  DownloadFileByLink: [download_file_by_link],
  // DownloadFileFromFolder: [download_file_from_folder],
  // DeleteFileFromFolder: [delete_file_from_folder],
  // GetFileInfo: [get_file_info],
  // UpdateUploadProgress: [update_upload_progress],

};

const EVENT_HANDLERS = {
  ApiError: [handle_api_error],
  // AccessPagePermissionCheckFail: [handle_access_perm_fail_error],
  UserLoginSuccess: [user_login_success],
  AccessTokenOutdated: [access_token_outdated],
  RefreshTokenOutdated: [refresh_token_outdated],
  UserLogoutSuccess: [user_logout_success],
  UploadFileError: [upload_file_error],
  UploadFileSuccess: [upload_file_success],
  DeleteFileSuccess: [delete_file_success],
};

class NotImplementedError extends Error {}

class MessageBus {
  static async handle(message, uow) {
    let result = [];
    let quenue = [message];
    // console.log("Enter message bus for message ", message);

    while (true) {
      // console.log("QUENUE = ", quenue);
      if (quenue.length === 0) break;

      const handle_function = async (current_message) => {
        // console.log(current_message);

        if (current_message instanceof Command) {
          const new_messages = await this.handle_command(
            current_message,
            uow,
            result
          );
          // console.log("New command messages ", new_messages);
          quenue = quenue.concat(new_messages);
        }

        if (current_message instanceof Event) {
          const new_messages = await this.handle_event(current_message, uow);
          // console.log("New event messages ", new_messages);
          quenue = quenue.concat(new_messages);
        }
      };

      // делаем "map" массива в промисы
      // ждем когда всё промисы будут выполнены
      const promises = quenue.map(handle_function);
      quenue = [];
      await Promise.all(promises);
    }

    // console.log("Leave message bus for message ", message);
    return result;
  }

  static async handle_command(message, uow, result) {
    let new_messages = [];

    if (
      !Object.prototype.hasOwnProperty.call(
        COMMAND_HANDLERS,
        message.constructor.name
      )
    ) {
      throw new NotImplementedError(
        'There is no handler for command "' + message.constructor.name + '"'
      );
    }

    const handlers = COMMAND_HANDLERS[message.constructor.name];

    const handle_function = async (handler) => {
      try {
        const command_result = await handler(message, uow);
        result.push(command_result);

        const events = uow.collect_new_messages();
        new_messages = new_messages.concat(events);
      } catch (e) {
        console.log(
          'Exception "' +
            e.toString() +
            '" handling command "' +
            message.constructor.name +
            '"'
        );
      }
    };

    // делаем "map" массива в промисы
    // ждем когда всё промисы будут выполнены
    const promises = handlers.map(handle_function);
    await Promise.all(promises);

    // console.log("Return command new messages");

    return new_messages;
  }

  static async handle_event(message, uow) {
    let new_messages = [];

    if (
      !Object.prototype.hasOwnProperty.call(
        EVENT_HANDLERS,
        message.constructor.name
      )
    ) {
      throw new NotImplementedError(
        'There is no handler for event "' + message.constructor.name + '"'
      );
    }

    const handlers = EVENT_HANDLERS[message.constructor.name];

    const handle_function = async (handler) => {
      try {
        await handler(message, uow);
        const events = uow.collect_new_messages();
        new_messages = new_messages.concat(events);
      } catch (e) {
        console.log(
          'Exception "' +
            e.toString() +
            '" handling event "' +
            message.constructor.name +
            '"'
        );
      }
    };

    // делаем "map" массива в промисы
    // ждем когда всё промисы будут выполнены
    const promises = handlers.map(handle_function);
    await Promise.all(promises);

    // console.log("Return event new messages");

    return new_messages;
  }
}

export { MessageBus };
