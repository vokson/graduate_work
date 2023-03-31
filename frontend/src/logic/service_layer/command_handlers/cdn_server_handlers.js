import {
  NegativeResponse,
  GetCdnServersRequest,
  GetCdnServersResponse,
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
    obj.location,
    obj.latitude,
    obj.longitude,
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
    console.log(response)
    response.data.forEach((obj) =>
      uow.cdn_server_repository.set(obj.id,
        convert_cdn_server_response_obj_to_model(obj)
      ))
    return;
  }

  throw new WrongResponseError();
};


export {
  get_cdn_servers,
};
