import {
  NegativeResponse,
  GetPermissionsRequest,
  GetPermissionsResponse,
  AddPermissionRequest,
  AddPermissionResponse,
  DeletePermissionRequest,
  DeletePermissionResponse,
  GetUserPermissionsRequest,
  GetUserPermissionsResponse,
  GetUserPermissionsForFolderRequest,
  GetUserPermissionsForFolderResponse,
} from "../../adapters/api";

import {
  ApiError,
  AddPermissionSuccess,
  DeletePermissionSuccess,
} from "../../domain/event";

class WrongResponseError extends Error {}

const get_permissions = async (event, uow) => {
  const request = new GetPermissionsRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetPermissionsResponse) {
    uow.role_permissions_repository.set_variants(response.permissions);
    return;
  }

  throw new WrongResponseError();
};

// OK
const add_permission = async (event, uow) => {
  const request = new AddPermissionRequest({
    role: event.role,
    permission: event.perm,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof AddPermissionResponse) {
    uow.role_permissions_repository.set(event.role, event.perm, true);
    uow.push_message(new AddPermissionSuccess());
    return;
  }

  throw new WrongResponseError();
};

// OK
const delete_permission = async (event, uow) => {
  const request = new DeletePermissionRequest({
    role: event.role,
    permission: event.perm,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof DeletePermissionResponse) {
    uow.role_permissions_repository.set(event.role, event.perm, false);
    uow.push_message(new DeletePermissionSuccess());
    return;
  }

  throw new WrongResponseError();
};

const get_user_permissions = async (event, uow) => {
  uow.permission_repository.reset();

  const request = new GetUserPermissionsRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetUserPermissionsResponse) {
    response.data.forEach((perm) => {
      uow.permission_repository.add(perm.name);
    });
    return;
  }

  throw new WrongResponseError();
};

// OK
const get_user_permissions_for_folder = async (event, uow) => {
  uow.permission_repository.reset_for_folder(event.folder_id);

  const request = new GetUserPermissionsForFolderRequest({
    folder_id: event.folder_id,
    usergroup_id: event.usergroup_id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetUserPermissionsForFolderResponse) {
    response.data.forEach((obj) => {
      uow.permission_repository.add_for_folder(event.folder_id, obj.name);
    });
    return;
  }

  throw new WrongResponseError();
};

export {
  get_permissions,
  add_permission,
  delete_permission,
  get_user_permissions,
  get_user_permissions_for_folder,
};
