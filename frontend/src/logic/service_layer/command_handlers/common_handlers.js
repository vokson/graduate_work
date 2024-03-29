import { Notify } from "../../domain/command";

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
    "User.DoesNotExist": ["error", "Неверные учетные данные"],
    "User.AlreadyExists": ["error", "Данный пользователь уже существует"],
    "File.DoesNotExist": ["error", "Файл не существует"],
    "File.AlreadyExists": ["error", "Файл с таким именем уже существует"],
    "FileShareLink.DoesNotExist": ["error", "Ссылка на файл не существует либо ее срок действия истек"],
    "CdnServer.ConnectionError": ["error", "CDN сервер не отвечает"],
    "CdnServer.AlreadyExists": ["error", "Сервер уже существует"],
    "CdnServer.DoesNotExist": ["error", "Сервер не найден"],
    "Login.Error.Credentials": ["error", "Неверные учетные данные"],
    "Auth.Error.TokenMissed": ["error", null],
    "Auth.Error.TokenOutdated": ["error", null],
    "Auth.Error.WrongTokenPayload": ["error", null],
    "Auth.Error.TokenWithWrongSignature": ["error", null],
    "Auth.Error.NoPermission": ["error", "Недостаточно прав"],
    "Database.Error": ["error", "Ошибка базы данных"],
    "Database.Error.UniqueViolation": ["error", "Ошибка базы данных"],
    "Request.Error.Validation": ["error", "Неверный запрос"],
    "Api.Server.Unavailable": ["error", "Сервер недоступен"],
    "Api.Server.InternalError": ["error", "Ошибка сервера"],
  }

  if (!Object.prototype.hasOwnProperty.call(errors, event.code)) {
    console.log('Неизвестный код ответа API "' + event.code + '"');
    uow.push_message(new Notify("error", "Неизвестная ошибка"));
    return;
  }
  const [level, text] = errors[event.code];
  if (text)
    uow.push_message(new Notify(level, text));
};


export {
  notify,
  notify_api_error,
};
