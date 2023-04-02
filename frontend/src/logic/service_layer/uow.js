import { VueFlatRepository } from "../adapters/flat_repository";
// import { VueBoxRepository } from "../adapters/box_repository";
import { VueUserRepository } from "../adapters/user_repository";
// import { VueUserGroupRepository } from "../adapters/usergroup_repository";
import { VueTokenRepository } from "../adapters/token_repository";
// import { VueFolderRepository } from "../adapters/folder_repository";
// import { VueDocRepository } from "../adapters/doc_repository";
// import { VueFileBoxRepository } from "../adapters/file_box_repository";
import { VueFileFlatRepository } from "../adapters/file_flat_repository";
// import { VueUserFolderSettingsRepository } from "../adapters/user_folder_settings_repository";
// import { VuePermissionRepository } from "../adapters/permission_repository";
// import { VueRolePermissionsRepository } from "../adapters/role_permissions_repository";
// import { VueFlatCurrentRepository } from "../adapters/flat_current_repository";
import { HttpApiProvider } from "../adapters/api_provider";
import { NotyNotificator } from "../adapters/notificator";
import { AbstractTimer } from "../adapters/timer";
// import { UploadProgressTimer, WaitSecondsTimer } from "../adapters/timer";
// import { VueFolderSettings } from "../adapters/folder_settings";
// import { VueInfoRepository } from "../adapters/info_repository";
// import { VueCartRepository } from "../adapters/cart_repository";
// import { VueCountableFlatRepository } from "../adapters/countable_flat_repository";

const token_timer = new AbstractTimer(5000);
const get_files_timer = new AbstractTimer(2000);

class AbstractUnitOfWork {
  constructor() {
    this.messages = [];
  }

  collect_new_messages = () => {
    const messages = [...this.messages];
    this.messages = [];

    return messages;
  };

  push_message = (message) => {
    // console.log('Push message "' + message.constructor.name + '"');
    this.messages.push(message);
  };
}

class VueUnitOfWork extends AbstractUnitOfWork {
  constructor() {
    super();
    this.api = new HttpApiProvider().get();
    this.notificator = new NotyNotificator();
    // this.upload_progress_timer = new UploadProgressTimer(2000); // Обновлять прогресс каждые 2 сек
    // this.wait_seconds_timer = new WaitSecondsTimer(1000); // Таймер для ожидания активации кнопок
    this.token_timer = token_timer
    this.get_files_timer = get_files_timer

    // this.info_repository = new VueInfoRepository("info");
    this.user_repository = new VueUserRepository("users");
    this.cdn_server_repository = new VueFlatRepository("cdn_servers");
    this.token_repository = new VueTokenRepository("tokens")

    // this.file_in_folder_repository = new VueFileBoxRepository(
    //   "files_in_folders"
    // );
    this.file_repository = new VueFileFlatRepository("files");
    // this.permission_repository = new VuePermissionRepository("permissions");
    // this.download_progress = new VueFileFlatRepository("download_progress");

    this.api.set_auth_token(this.token_repository.get_access_token());
  }
}

export { VueUnitOfWork };
