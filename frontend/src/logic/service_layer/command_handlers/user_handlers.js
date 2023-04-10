import {
  NegativeResponse,
  LoginCredentialsRequest,
  LoginCredentialsResponse,
  LogoutRequest,
  LogoutResponse,
  MyCredentialsRequest,
  MyCredentialsResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  GetUserActionsRequest,
  GetUserActionsResponse,
} from "../../adapters/api";

import {
  ApiError,
  UserLoginSuccess,
  RefreshTokenOutdated,
  UserLogoutSuccess,
} from "../../domain/event";

import { User, UserAction } from "../../domain/model";

class WrongResponseError extends Error { }

const convert_user_response_obj_to_model = (obj) => {
  const user = new User(
    obj.username,
    obj.email,
    obj.first_name,
    obj.last_name,
    obj.is_superuser,
    obj.permissions
  );

  return user;
};

const login_with_credentials = async (event, uow) => {
  uow.user_repository.reset_keeping_refs();
  uow.token_repository.reset();

  const request = new LoginCredentialsRequest({
    username: event.username,
    password: event.password,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof LoginCredentialsResponse) {
    uow.token_repository.set_access_token(response.data.access_token);
    uow.token_repository.set_refresh_token(response.data.refresh_token);
    uow.api.set_auth_token(response.data.access_token);
    uow.push_message(new UserLoginSuccess());
    return;
  }

  throw new WrongResponseError();
};

const my_credentials = async (event, uow) => {
  const request = new MyCredentialsRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof MyCredentialsResponse) {
    uow.user_repository.set_current(
      convert_user_response_obj_to_model(response.data)
    );
    return;
  }

  throw new WrongResponseError();
};

const refresh_tokens = async (event, uow) => {
  const access_token = uow.token_repository.get_access_token()
  const refresh_token = uow.token_repository.get_refresh_token()

  console.log('CURRENT REFRESH TOKEN', refresh_token);

  if (!refresh_token) {
    uow.push_message(new RefreshTokenOutdated());
    return;
  }

  if (access_token) {
    return;
  }

  uow.api.set_auth_token(refresh_token);
  console.log('SET AUTH TOKEN - REFRESH')

  const request = new RefreshTokensRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    if (response.data.code === 'Auth.Error.TokenOutdated') {
      uow.push_message(new RefreshTokenOutdated());
    }
    else
      uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof RefreshTokensResponse) {
    console.log('NEW REFRESH TOKEN', response.data.refresh_token);
    uow.token_repository.set_access_token(response.data.access_token);
    uow.token_repository.set_refresh_token(response.data.refresh_token);
    uow.api.set_auth_token(response.data.access_token);
    console.log('SET AUTH TOKEN - NEW ACCESS')
    uow.token_timer.start()
    return;
  }

  throw new WrongResponseError();
};

const logout = async (event, uow) => {
  const request = new LogoutRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof LogoutResponse) {
    uow.user_repository.reset();
    uow.token_repository.reset();
    uow.push_message(new UserLogoutSuccess());
    return;
  }

  throw new WrongResponseError();
};

const convert_user_action_response_obj_to_model = (obj) => {
  const user = new UserAction(
    obj.id,
    obj.event,
    obj.data,
    new Date(obj.created),
  );

  return user;
};


const get_user_actions = async (event, uow) => {
  uow.action_repository.reset_keeping_refs();

  const request = new GetUserActionsRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetUserActionsResponse) {
    response.data.forEach((obj) =>
      uow.action_repository.set(obj.id,
        convert_user_action_response_obj_to_model(obj)
      ))
    return;
  }

  throw new WrongResponseError();
};


export {
  login_with_credentials,
  my_credentials,
  refresh_tokens,
  logout,
  get_user_actions,
};
