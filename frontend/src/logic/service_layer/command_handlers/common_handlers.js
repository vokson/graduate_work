import { Notify } from "../../domain/command";

// import {
//   NegativeResponse,
//   GetInfoRequest,
//   GetInfoResponse,
// } from "../../adapters/api";

// import {
//   ApiError,
// } from "../../domain/event";

// class WrongResponseError extends Error {}
class WrongErrorType extends Error { }

const notify = (event, uow) => {
  const actions = {
    success: uow.notificator.success,
    warning: uow.notificator.warning,
    info: uow.notificator.info,
    error: uow.notificator.error,
  };

  if (!Object.prototype.hasOwnProperty.call(actions, event.level)) {
    throw new WrongErrorType('Wrong error type "' + event.level + '"');
  }

  actions[event.level](event.text);
};

const notify_api_error = (event, uow) => {
  const errors = {
    "User.DoesNotExists": ["error", "Неверные учетные данные"],
    "Auth.Error.TokenOutdated": ["error", "Время жизни токена истекло"],
    "Auth.Error.WrongTokenPayload": ["error", 'Неверный payload токена'],
    "Request.Error.Validation": ["error", "Неверный запрос"],
    // "Auth.Token.Fail": ["error", "Неверные учетные данные"],
    // "Auth.Token.Blocked": ["error", "Учетная запись заблокирована"],
    // "Auth.Token.NotAllowed": ["error", "Недостаточно прав доступа"],
    // "User.Error.WrongOnBehalf": [
    //   "error",
    //   "Вы не можете работать от данного пользователя",
    // ],

    "Api.Server.Unavailable": ["error", "Сервер недоступен"],
    "Api.Server.InternalError": ["error", "Ошибка сервера"],

    // "Database.Error.Integrity": ["error", "Ошибка базы данных"],
    // "Database.Error.Validation": ["error", "Неверные входные данные"],
    // "Database.Error.Protected": ["error", "Ошибка удаления связанных данных"],

    // "Request.Body.NotJson": ["error", "Неверный запрос"],
    // "Parameter.Body.Wrong": ["error", "Неверный запрос"],
    // "Parameter.Path.Wrong": ["error", "Неверный запрос"],
    // "Parameter.Query.Wrong": ["error", "Неверный запрос"],

    // "Storage.Error.NotAvailable": ["error", "Хранилище файлов не доступно"],

    // "Document.Error.Blocked": ["error", "Документ заблокирован"],
    // "DocumentApproval.Error.AlreadyDone": [
    //   "error",
    //   "Согласование уже выполнено",
    // ],
    // "DocumentApproval.Error.CanNotBeDeleted": [
    //   "error",
    //   "Согласование не может быть удалено. Возможно запущен поток согласований.",
    // ],
    // "DocumentApproval.Error.CanNotDelegate": [
    //   "error",
    //   "Делегирование невозможно",
    // ],
    // "DocumentApproval.Error.AlreadyDelegated": [
    //   "error",
    //   "Согласование уже делегировано",
    // ],
    // "DocumentApproval.Error.HasBeenDelegatedWithReturn": [
    //   "error",
    //   "Делегирования с возвратом не завершены",
    // ],
    // "DocumentApprovalFile.Error.CanNotBeDeleted": [
    //   "error",
    //   "Файл согласования не может быть удален",
    // ],
    // "DocumentApprovalFlow.Error.Blocked": [
    //   "error",
    //   "Поток согласований заблокирован",
    // ],
    // "DocumentApprovalFlow.Error.DoesNotExist": [
    //   "error",
    //   "Поток согласований не существует",
    // ],
    // "DocumentApprovalFlow.Error.AlreadyStarted": [
    //   "error",
    //   "Поток согласований уже запущен",
    // ],
    // "DocumentApprovalFlow.Error.AlreadyStopped": [
    //   "error",
    //   "Поток согласований уже остановлен",
    // ],
    // "File.Blocked.AttachedToDocument": ["error", "Файл прикреплен к документу"],
    // "File.Uploaded.ZeroSize": [
    //   "error",
    //   "Загруженный файл имеет нулевой размер",
    // ],
    // "File.Error.TooLarge": [
    //   "error",
    //   "Слишком большой файл",
    // ],
    // "MailReceiver.Error.Login": [
    //   "error",
    //   "Ошибка при подключении к почтовому ящику",
    // ],
    // "MailReceiver.Error.List": [
    //   "error",
    //   "Ошибка при получении списка сообщений из почтового ящика",
    // ],
    // "MailReceiver.Error.Fetch": [
    //   "error",
    //   "Ошибка при получении сообщения из почтового ящика",
    // ],
    // "MailParser.Error.WrongBytes": [
    //   "error",
    //   "Ошибка при парсинге сообщения",
    // ],
    // "MailParser.Error.Headers": [
    //   "error",
    //   "Ошибка при получении заголовков сообщения",
    // ],
    // "MailParser.Error.TextBody": [
    //   "error",
    //   "Ошибка при получении тела сообщения в формате text",
    // ],
    // "MailParser.Error.HtmlBody": [
    //   "error",
    //   "Ошибка при получении тела сообщения в формате html",
    // ],
    // "MailParser.Error.Attachment": [
    //   "error",
    //   "Ошибка при получении вложения сообщения",
    // ],
    // "MailParser.Error.CidImage": [
    //   "error",
    //   "Ошибка при извлечении изображения из письма",
    // ],
    // "MailParser.Error.ConvertHtmlBody": [
    //   "error",
    //   "Ошибка при конвертировании тела сообщения в формате html",
    // ],
    // "MailChannel.Error.Settings": [
    //   "error",
    //   "Неверные настройки почтового канала",
    // ],
    // "MailMessage.Body.NotFound": [
    //   "error",
    //   "Тело сообщения в запрошенном формате отсутствует",
    // ],
    // "Pdf.Error.Operation": [
    //   "error",
    //   "Ошибка операции над PDF файлом",
    // ],
    // "Transmittal.Error.CoverSheet": [
    //   "error",
    //   "Ошибка создания накладной трансмиттала",
    // ],
  };

  if (!Object.prototype.hasOwnProperty.call(errors, event.code)) {
    console.log('Неизвестный код ответа API "' + event.code + '"');
    uow.push_message(new Notify("error", "Неизвестная ошибка"));
    return;
  }
  const [level, text] = errors[event.code];
  uow.push_message(new Notify(level, text));
};

// const get_info = async (event, uow) => {
//   const request = new GetInfoRequest();
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetInfoResponse) {
//     uow.info_repository.set_approval_actions_count(
//       response.data.approval_actions_count
//     );
//     uow.info_repository.set_approval_orders_count(
//       response.data.approval_orders_count
//     );
//     return;
//   }

//   throw new WrongResponseError();
// };


export {
  notify,
  notify_api_error,
  // get_info,
};
