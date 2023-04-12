import {
  Notify,
  NotifyApiError,
} from "../domain/command";
import router from "../../router";

const handle_api_error = (event, uow) => {
  uow.push_message(new NotifyApiError(event.code));
};

const user_login_success = async (event, uow) => {
  uow.push_message(new Notify("success", "Вы вошли в систему"));
};

const access_token_outdated = async (event, uow) => {
  uow.push_message(new Notify("error", "Время жизни Access Token истекло"));
};

const refresh_token_outdated = async (event, uow) => {
  uow.push_message(new Notify("error", "Время жизни Refresh Token истекло. Пожалуйста, войдите заново."));
  router.push({
    name: "LoginPage",
    // query: { url: encodeURIComponent(route.fullPath) },
  });
  // await MessageBus.handle(new GetUserPermissions(), uow);
};

const user_logout_success = (event, uow) => {
  uow.push_message(new Notify("info", "Вы вышли из системы"));
};

const upload_file_error = (event, uow) => {
  uow.push_message(
    new Notify("error", `Ошибка загрузки файла ${event.filename}`)
  );
};

const upload_file_success = (event, uow) => {
  uow.push_message(new Notify("success", `Файл добавлен`));
};

const download_file_success = (event, uow) => {
  uow.push_message(new Notify("success", `Файл скачан`));
};

const rename_file_success = (event, uow) => {
  uow.push_message(new Notify("success", `Файл переименован`));
};

const delete_file_success = (event, uow) => {
  uow.push_message(new Notify("success", `Файл удален`));
};

const file_share_link_copied = (event, uow) => {
  uow.push_message(
    new Notify("success", `Ссылка на файл скопирована в буфер обмена`)
  );
};

const file_share_link_deleted = (event, uow) => {
  uow.push_message(
    new Notify("success", `Ссылка на файл удалена`)
  );
};

const cdn_server_added = (event, uow) => {
  uow.push_message(
    new Notify("success", `Сервер добавлен`)
  );
};

const cdn_server_updated = (event, uow) => {
  uow.push_message(
    new Notify("success", `Сервер обновлен`)
  );
};

const cdn_server_deleted = (event, uow) => {
  uow.push_message(
    new Notify("success", `Сервер удален`)
  );
};




export {
  handle_api_error,
  user_login_success,
  access_token_outdated,
  refresh_token_outdated,
  user_logout_success,
  upload_file_error,
  upload_file_success,
  download_file_success,
  rename_file_success,
  delete_file_success,
  file_share_link_copied,
  file_share_link_deleted,
  cdn_server_added,
  cdn_server_updated,
  cdn_server_deleted
};
