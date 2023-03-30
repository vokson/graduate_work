import {
  Notify,
  NotifyApiError,
  RefreshTokens,
  // MyCredentials,
  // ValidateDocument,
  // GetRoles,
  // GetInfo,
  // GetPermissionsByRoles,
} from "../domain/command";
import { MessageBus } from "../service_layer/message_bus";
import router from "../../router";

const handle_api_error = (event, uow) => {
  if (event.code === "Auth.Token.Fail") {
    return;
  }
  uow.push_message(new NotifyApiError(event.code));
};

// const handle_access_perm_fail_error = (event, uow) => {
//   uow.push_message(
//     new Notify("error", "Недостаточно прав для доступа к странице")
//   );
// };

const user_login_success = async (event, uow) => {
  uow.push_message(new Notify("success", "Вы вошли в систему"));
};

const access_token_outdated = async (event, uow) => {
  uow.push_message(new Notify("error", "Время жизни Access Token истекло"));
  uow.push_message(new Notify("warning", "Пробуем обновить Access Token"));
  await MessageBus.handle(new RefreshTokens(), uow);
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

// const users_get_success = (event, uow) => {
//   uow.push_message(new Notify("info", "Данные пользователей получены"));
// };

// const users_update_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Сохранено"));
// };

// const users_delete_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Удалено"));
// };

// const user_replacement_add_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Замещение добавлено"));
// };

// const user_replacement_delete_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Замещение удалено"));
// };

// const on_behalf_user_change_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Установлено. Обновите страницу."));
// };

// const on_behalf_user_delete_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Вы работаете от своего имени. Обновите станицу."));
// };

// const folders_add_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Сохранено"));
// };

// const folders_update_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Сохранено"));
// };

// const folders_delete_success = (event, uow) => {
//   uow.push_message(new Notify("success", "Удалено"));
// };

// const handle_upload_file_error = (event, uow) => {
//   uow.push_message(
//     new Notify("error", `Ошибка загрузки файла ${event.filename}`)
//   );
// };

// const handle_upload_empty_file_error = (event, uow) => {
//   uow.push_message(
//     new Notify("error", `Файл "${event.filename}" имеет нулевой размер`)
//   );
// };

// const handle_upload_file_too_big_error = (event, uow) => {
//   uow.push_message(
//     new Notify("error", `Файл "${event.filename}" слишком велик`)
//   );
// };

// const handle_upload_file_wrong_extension_error = (event, uow) => {
//   uow.push_message(
//     new Notify(
//       "error",
//       `Файл "${event.filename}" имеет неправильное расширение`
//     )
//   );
// };

// const handle_upload_file_wrong_filename_error = (event, uow) => {
//   uow.push_message(
//     new Notify(
//       "error",
//       `Файл "${event.filename}" имеет неправильное имя`
//     )
//   );
// };

// const handle_upload_file_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Файл загружен`));
// };

// const handle_save_many_documents_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Сохранение завершено`));
// };

// const handle_delete_many_documents_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Удаление завершено`));
// };

// const handle_document_attributes_changed = (event, uow) => {
//   uow.push_message(
//     new ValidateDocument(event.folder_id, event.usergroup_id, event.document_id)
//   );
// };

// const handle_duplicate_document_to_usergroup_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Документ успешно скопирован`));
// };

// const handle_duplicate_many_documents_to_usergroup_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Документы успешно скопированы`));
// };

// const handle_document_files_are_uploading = (event, uow) => {
//   uow.push_message(new Notify("error", `Загрузка файлов еще продолжается`));
// };

// const handle_file_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Файл обновлен`));
// };

// const handle_file_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Файл удален`));
// };

// const handle_file_attached_to_document = (event, uow) => {
//   uow.push_message(
//     new ValidateDocument(event.folder_id, event.usergroup_id, event.document_id)
//   );
// };

// const handle_file_detached_from_document = (event, uow) => {
//   uow.push_message(
//     new ValidateDocument(event.folder_id, event.usergroup_id, event.document_id)
//   );
// };

// const handle_files_allocated = (event, uow) => {
//   uow.push_message(new Notify("success", `Загруженные файлы распределены`));
// };

// const handle_document_button_pushed = (event, uow) => {
//   uow.push_message(new Notify("success", `Действие выполнено`));
// };

// const handle_add_role_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Роль добавлена`));
//   uow.push_message(new GetRoles());
// };

// const handle_delete_role_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Роль удалена`));
//   uow.push_message(new GetRoles());
// };

// const handle_add_user_folder_settings_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Настройки добавлены`));
// };

// const handle_set_user_folder_settings_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Настройки установлены`));
// };

// const handle_delete_user_folder_settings_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Настройки удалены`));
// };

// const handle_set_user_search_schema_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Пользовательская схема установлена`));
// };

// const handle_add_permission_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Разрешение добавлено`));
// };

// const handle_delete_permission_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Разрешение удалено`));
// };

// const handle_document_link_copied = (event, uow) => {
//   uow.push_message(new Notify("success", `Ссылка на документ скопирована`));
// };

// const handle_file_link_copied = (event, uow) => {
//   uow.push_message(new Notify("success", `Ссылка на файл скопирована`));
// };

// const handle_add_user_group_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Группа пользователей добавлена`));
// };

// const handle_update_user_group_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Группа пользователей обновлена`));
// };

// const handle_delete_user_group_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Группа пользователей удалена`));
// };

// const handle_user_group_has_not_been_assigned = (event, uow) => {
//   uow.push_message(new Notify("error", `Не выбрана группа пользователей`));
// };

// const handle_document_added_to_cart_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Документ добавлен в корзину`));
// };

// const handle_document_removed_from_cart_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Документ удален из корзины`));
// };

// const handle_many_documents_added_to_cart_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Документы добавлены в корзину`));
// };

// const handle_add_flow_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Поток создан`));
// };

// const handle_update_flow_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Поток обновлен`));
// };

// const handle_delete_flow_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Поток удален`));
// };

// const handle_restart_flow_item_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Экземпляр потока перезапущен`));
// };

// const handle_self_testing_replied_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Правильно`));
// };

// const handle_self_testing_replied_fail = (event, uow) => {
//   uow.push_message(new Notify("error", `Неверно`));
// };

// const handle_document_approval_added_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Запрос на согласование добавлен`));
//   uow.push_message(new GetInfo());
// };

// const handle_document_approval_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Согласование/Отклонение выполнено`));
//   uow.push_message(new GetInfo());
// };

// const handle_document_approval_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Согласование удалено`));
//   uow.push_message(new GetInfo());
// };

// const handle_document_approval_delegated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Согласование делегировано`));
//   uow.push_message(new GetInfo());
// };

// const handle_empty_approval_flow_saved = (event, uow) => {
//   uow.push_message(new Notify("error", `Нельзя сохранить пустой поток согласований`));
// };

// const handle_approval_flow_upload_error = (event, uow) => {
//   uow.push_message(new Notify("error", `Ошибка загрузки потока согласований`));
// };

// const handle_approval_flow_started = (event, uow) => {
//   uow.push_message(new Notify("success", `Поток согласований запущен`));
//   uow.push_message(new GetInfo());
// };

// const handle_approval_flow_stopped = (event, uow) => {
//   uow.push_message(new Notify("success", `Поток согласований остановлен`));
//   uow.push_message(new GetInfo());
// };

// const handle_server_setting_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Параметр изменен`));
// };

// const handle_mailbox_added_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый ящик добавлен`));
// };

// const handle_mailbox_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый ящик изменен`));
// };

// const handle_mailbox_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый ящик удален`));
// };

// const handle_mail_channel_added_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый канал добавлен`));
// };

// const handle_mail_channel_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый канал изменен`));
// };

// const handle_mail_channel_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Почтовый канал удален`));
// };

// const handle_mail_channel_fetched_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Письма в почтовом канале обновлены`));
// };

// const handle_mail_message_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Письмо удалено`));
// };

// const handle_counter_added_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Счетчик добавлен`));
// };

// const handle_counter_updated_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Счетчик изменен`));
// };

// const handle_counter_deleted_success = (event, uow) => {
//   uow.push_message(new Notify("success", `Счетчик удален`));
// };

export {
  handle_api_error,
  // handle_access_perm_fail_error,
  user_login_success,
  access_token_outdated,
  refresh_token_outdated,
  user_logout_success,
  // users_get_success,
  // users_update_success,
  // users_delete_success,
  // user_replacement_add_success,
  // user_replacement_delete_success,
  // on_behalf_user_change_success,
  // on_behalf_user_delete_success,
  // folders_add_success,
  // folders_update_success,
  // folders_delete_success,
  // handle_upload_file_error,
  // handle_upload_empty_file_error,
  // handle_upload_file_too_big_error,
  // handle_upload_file_wrong_extension_error,
  // handle_upload_file_wrong_filename_error,
  // handle_upload_file_success,
  // handle_save_many_documents_success,
  // handle_delete_many_documents_success,
  // handle_document_attributes_changed,
  // handle_duplicate_document_to_usergroup_success,
  // handle_duplicate_many_documents_to_usergroup_success,
  // handle_document_files_are_uploading,
  // handle_document_button_pushed,
  // handle_file_updated_success,
  // handle_file_deleted_success,
  // handle_files_allocated,
  // handle_file_attached_to_document,
  // handle_file_detached_from_document,
  // handle_add_role_success,
  // handle_delete_role_success,
  // handle_add_user_folder_settings_success,
  // handle_set_user_folder_settings_success,
  // handle_delete_user_folder_settings_success,
  // handle_set_user_search_schema_success,
  // handle_add_permission_success,
  // handle_delete_permission_success,
  // handle_document_link_copied,
  // handle_file_link_copied,
  // handle_add_user_group_success,
  // handle_update_user_group_success,
  // handle_delete_user_group_success,
  // handle_user_group_has_not_been_assigned,
  // handle_document_added_to_cart_success,
  // handle_document_removed_from_cart_success,
  // handle_many_documents_added_to_cart_success,
  // handle_add_flow_success,
  // handle_update_flow_success,
  // handle_delete_flow_success,
  // handle_restart_flow_item_success,
  // handle_self_testing_replied_success,
  // handle_self_testing_replied_fail,
  // handle_document_approval_added_success,
  // handle_document_approval_updated_success,
  // handle_document_approval_deleted_success,
  // handle_document_approval_delegated_success,
  // handle_empty_approval_flow_saved,
  // handle_approval_flow_started,
  // handle_approval_flow_stopped,
  // handle_approval_flow_upload_error,
  // handle_server_setting_updated_success,
  // handle_mailbox_added_success,
  // handle_mailbox_updated_success,
  // handle_mailbox_deleted_success,
  // handle_mail_channel_added_success,
  // handle_mail_channel_updated_success,
  // handle_mail_channel_deleted_success,
  // handle_mail_channel_fetched_success,
  // handle_mail_message_deleted_success,
  // handle_counter_added_success,
  // handle_counter_updated_success,
  // handle_counter_deleted_success,
};
