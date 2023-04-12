import {
  NegativeResponse,
  GetCdnServersRequest,
  GetCdnServersResponse,
  AddCdnServerRequest,
  AddCdnServerResponse,
  UpdateCdnServerRequest,
  UpdateCdnServerResponse,
  DeleteCdnServerRequest,
  DeleteCdnServerResponse,
  GetFileServersRequest,
  GetFileServersResponse,
} from "../../adapters/api";

import {
  ApiError,
} from "../../domain/event";

import { CdnServer } from "../../domain/model";

class WrongResponseError extends Error { }

const convert_cdn_server_response_obj_to_model = (obj) => {
  const user = new CdnServer(
    obj.id,
    obj.name,
    obj.host,
    obj.port,
    obj.location,
    obj.zone,
    obj.latitude,
    obj.longitude,
    obj.is_on,
    obj.is_active,
    obj.created,
    obj.updated
  );

  return user;
};

const get_cdn_servers = async (event, uow) => {
  const request = new GetCdnServersRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetCdnServersResponse) {
    response.data.forEach((obj) =>
      uow.cdn_server_repository.set(obj.id,
        convert_cdn_server_response_obj_to_model(obj)
      ))
    return;
  }

  throw new WrongResponseError();
};

const add_cdn_server = async (event, uow) => {
  const request = new AddCdnServerRequest({
    name: event.name,
    host: event.host,
    port: event.port,
    location: event.location,
    zone: event.zone,
    latitude: event.latitude,
    longitude: event.longitude,
    is_on: event.is_on,
    is_active: event.is_active,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof AddCdnServerResponse) {
    const obj = response.data;
    uow.cdn_server_repository.set(obj.id,
      convert_cdn_server_response_obj_to_model(obj)
    )
    return;
  }

  throw new WrongResponseError();
};

const update_cdn_server = async (event, uow) => {
  const request = new UpdateCdnServerRequest({
    id: event.id,
    name: event.name,
    host: event.host,
    port: event.port,
    location: event.location,
    zone: event.zone,
    latitude: event.latitude,
    longitude: event.longitude,
    is_on: event.is_on,
    is_active: event.is_active,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof UpdateCdnServerResponse) {
    const obj = response.data;
    uow.cdn_server_repository.set(obj.id,
      convert_cdn_server_response_obj_to_model(obj)
    )
    return;
  }

  throw new WrongResponseError();
};

const delete_cdn_server = async (event, uow) => {
  const request = new DeleteCdnServerRequest({
    id: event.id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof DeleteCdnServerResponse) {
    uow.cdn_server_repository.delete(event.id)
    return;
  }

  throw new WrongResponseError();
};

const get_file_servers = async (event, uow) => {
  const request = new GetFileServersRequest({ id: event.id, });
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetFileServersResponse) {
    const servers = response.data.map((obj) =>
      convert_cdn_server_response_obj_to_model(obj))

    uow.file_repository.set_servers(event.id, servers)
    return;
  }

  throw new WrongResponseError();
};


export {
  get_file_servers,
  get_cdn_servers,
  add_cdn_server,
  update_cdn_server,
  delete_cdn_server,
};
