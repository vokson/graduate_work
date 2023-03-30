import {
  NegativeResponse,
  LoginCredentialsRequest,
  LoginCredentialsResponse,
  MyCredentialsRequest,
  MyCredentialsResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  // LoginTokenRequest,
  // LoginTokenResponse,
  // GetUsersRequest,
  // GetUsersResponse,
  // SetUserRequest,
  // SetUserResponse,
  // DeleteUserRequest,
  // DeleteUserResponse,
  // GetUserReplacementsRequest,
  // GetUserReplacementsResponse,
  // AddUserReplacementRequest,
  // AddUserReplacementResponse,
  // DeleteUserReplacementRequest,
  // DeleteUserReplacementResponse,
  // GetUserReplacementsOfUserRequest,
  // GetUserReplacementsOfUserResponse,
  // AddUserReplacementToUserRequest,
  // AddUserReplacementToUserResponse,
  // DeleteUserReplacementFromUserRequest,
  // DeleteUserReplacementFromUserResponse,
  // GetOnBehalfUsersRequest,
  // GetOnBehalfUsersResponse,
  // SetOnBehalfUserRequest,
  // SetOnBehalfUserResponse,
  // DeleteOnBehalfUserRequest,
  // DeleteOnBehalfUserResponse,
} from "../../adapters/api";

import {
  ApiError,
  UserLoginSuccess,
  RefreshTokenOutdated,
  UserLogoutSuccess,
  // UsersUpdateSuccess,
  // UsersDeleteSuccess,
  // UserReplacementAddSuccess,
  // UserReplacementDeleteSuccess,
  // OnBehalfUserChangeSuccess,
  // OnBehalfUserDeleteSuccess,
} from "../../domain/event";

import { User } from "../../domain/model";

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
    console.log(response)
    return;
  }

  throw new WrongResponseError();
};

const refresh_tokens = async (event, uow) => {
  const access_token = uow.token_repository.get_access_token()
  const refresh_token = uow.token_repository.get_refresh_token()

  if (!refresh_token) {
    uow.push_message(new RefreshTokenOutdated());
    return;
  }

  if (access_token) {
    return;
  }

  uow.token_repository.reset();
  uow.api.set_auth_token(refresh_token);

  const request = new RefreshTokensRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    if (response.data.code === 'Auth.Error.TokenOutdated')
      uow.push_message(new RefreshTokenOutdated());
    else
      uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof RefreshTokensResponse) {
    console.log(response)
    uow.token_repository.set_access_token(response.data.access_token);
    uow.token_repository.set_refresh_token(response.data.refresh_token);
    uow.api.set_auth_token(response.data.access_token);
    return;
  }

  throw new WrongResponseError();
};

const logout = (event, uow) => {
  uow.user_repository.reset();
  uow.token_repository.reset();
  uow.push_message(new UserLogoutSuccess());
};

// const get_users = async (event, uow) => {
//   const request = new GetUsersRequest();

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetUsersResponse) {
//     response.data.forEach((e) => {
//       const user = convert_user_response_obj_to_model(e);
//       uow.user_repository.set(user.username, user);
//     });

//     return;
//   }

//   throw new WrongResponseError();
// };

// const set_user = async (event, uow) => {
//   const request = new SetUserRequest({
//     username: event.username,
//     is_active: event.is_active,
//     access_group_regex: event.access_group_regex,
//     role: event.role,
//     role_inside_group: event.role_inside_group,
//     role_outside_group: event.role_outside_group,
//   });

//   const response = await uow.api.call(request);
//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof SetUserResponse) {
//     const user = convert_user_response_obj_to_model(response.data);
//     uow.user_repository.set(user.username, user);
//     uow.push_message(new UsersUpdateSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const delete_user = async (event, uow) => {
//   const request = new DeleteUserRequest({
//     username: event.username,
//   });

//   const response = await uow.api.call(request);
//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DeleteUserResponse) {
//     uow.user_repository.delete(event.username);
//     uow.push_message(new UsersDeleteSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const get_user_replacements = async (event, uow) => {
//   const current_user = uow.user_repository.get_current();

//   const request = new GetUserReplacementsRequest();
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetUserReplacementsResponse) {
//     response.data.forEach((e) => {
//       const user = convert_user_response_obj_to_model(e);
//       uow.user_replacement_repository.set(
//         current_user.value.username,
//         user.username,
//         user
//       );
//     });

//     return;
//   }

//   throw new WrongResponseError();
// };

// const add_user_replacement = async (event, uow) => {
//   const current_user = uow.user_repository.get_current();

//   const request = new AddUserReplacementRequest({
//     username: event.username,
//   });
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof AddUserReplacementResponse) {
//     const user = convert_user_response_obj_to_model(response.data);
//     uow.user_replacement_repository.set(
//       current_user.value.username,
//       user.username,
//       user
//     );
//     uow.push_message(new UserReplacementAddSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const delete_user_replacement = async (event, uow) => {
//   const current_user = uow.user_repository.get_current();

//   const request = new DeleteUserReplacementRequest({
//     username: event.username,
//   });

//   const response = await uow.api.call(request);
//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DeleteUserReplacementResponse) {
//     uow.user_replacement_repository.delete(
//       current_user.value.username,
//       event.username
//     );
//     uow.push_message(new UserReplacementDeleteSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const get_user_replacements_of_user = async (event, uow) => {
//   uow.user_replacement_repository.reset_keeping_refs(event.username);

//   const request = new GetUserReplacementsOfUserRequest({
//     username: event.username,
//   });
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetUserReplacementsOfUserResponse) {
//     response.data.forEach((e) => {
//       const user = convert_user_response_obj_to_model(e);
//       uow.user_replacement_repository.set(
//         event.username,
//         user.username,
//         user
//       );
//     });

//     return;
//   }

//   throw new WrongResponseError();
// };

// const add_user_replacement_to_user = async (event, uow) => {
//   const request = new AddUserReplacementToUserRequest({
//     username_to_be_replaced : event.username_to_be_replaced,
//     replaced_with_username : event.replaced_with_username
//   });
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof AddUserReplacementToUserResponse) {
//     const user = convert_user_response_obj_to_model(response.data);
//     uow.user_replacement_repository.set(
//       event.username_to_be_replaced,
//       user.username,
//       user
//     );
//     uow.push_message(new UserReplacementAddSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const delete_user_replacement_from_user = async (event, uow) => {
//   const request = new DeleteUserReplacementFromUserRequest({
//     username_to_be_replaced : event.username_to_be_replaced,
//     replaced_with_username : event.replaced_with_username
//   });

//   const response = await uow.api.call(request);
//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DeleteUserReplacementFromUserResponse) {
//     uow.user_replacement_repository.delete(
//       event.username_to_be_replaced,
//       event.replaced_with_username
//     );
//     uow.push_message(new UserReplacementDeleteSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };


// const get_on_behalf_users = async (event, uow) => {
//   const request = new GetOnBehalfUsersRequest();
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetOnBehalfUsersResponse) {
//     uow.user_repository.set_on_behalf_users(
//       response.data.map((e) => convert_user_response_obj_to_model(e))
//     );
//     return;
//   }

//   throw new WrongResponseError();
// };

// const set_on_behalf_user = async (event, uow) => {
//   const request = new SetOnBehalfUserRequest({
//     username: event.username,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof SetOnBehalfUserResponse) {
//     uow.user_repository.set_current(
//       convert_user_response_obj_to_model(response.data)
//     );
//     uow.push_message(new OnBehalfUserChangeSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const delete_on_behalf_user = async (event, uow) => {
//   const request = new DeleteOnBehalfUserRequest({
//     username: event.username,
//   });
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DeleteOnBehalfUserResponse) {
//     uow.user_repository.set_current(
//       convert_user_response_obj_to_model(response.data)
//     );
//     uow.push_message(new OnBehalfUserDeleteSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// // Возвращает объект, в котором ключи - email, значения - Фамилия Имя пользователей
// // Пользователи должны быть загружены в репозиторий
// const get_user_email_context = async (event, uow) => {
//   const users = uow.user_repository
//     .values()
//     .map((e) => e.value)
//     .filter((e) => e.is_active === true);

//   let attrs = {};
//   users.forEach((x) => {
//     if (x.email) attrs[x.email] = (x.last_name + " " + x.first_name).trim();
//   });

//   uow.context_repository.set(event.ctx_id, event.ctx_name, attrs);
// };

export {
  login_with_credentials,
  my_credentials,
  refresh_tokens,
  // login_with_token,
  logout,
  // get_users,
  // set_user,
  // delete_user,
  // get_user_replacements,
  // add_user_replacement,
  // delete_user_replacement,
  // get_user_replacements_of_user,
  // add_user_replacement_to_user,
  // delete_user_replacement_from_user,
  // get_on_behalf_users,
  // set_on_behalf_user,
  // delete_on_behalf_user,
  // get_user_email_context,
};
