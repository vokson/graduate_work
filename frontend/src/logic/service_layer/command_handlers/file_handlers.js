// import { v4 as uuidv4 } from "uuid";

import {
  NegativeResponse,
  GetFilesRequest,
  GetFilesResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  RenameFileRequest,
  RenameFileResponse,
  UploadFileRequest,
  UploadFileResponse,
  GetUploadLinkRequest,
  GetUploadLinkResponse,
  GetDownloadLinkRequest,
  GetDownloadLinkResponse,
  DownloadFileRequest,
  DownloadFileResponse,
  AddFileShareLinkRequest,
  AddFileShareLinkResponse,
  GetFileShareLinksRequest,
  GetFileShareLinksResponse,
  GetFileShareLinkRequest,
  GetFileShareLinkResponse,
  DeleteFileShareLinkRequest,
  DeleteFileShareLinkResponse,
  GetDownloadLinkByFileShareLinkRequest,
  GetDownloadLinkByFileShareLinkResponse,
} from "../../adapters/api";

import {
  UploadFileByLink,
  DownloadFileByLink
} from "../../domain/command";

import {
  ApiError,
  UploadFileError,
  UploadFileSuccess,
  DownloadFileSuccess,
  DeleteFileSuccess,
  RenameFileSuccess,
  FileShareLinkDeleted
} from "../../domain/event";

import { File, ShareLink } from "../../domain/model";
import { js_download_file } from "../utils/file_download";
import { v4 as uuidv4 } from "uuid";

class WrongResponseError extends Error { }

const convert_file_response_obj_to_model = (obj) => {
  const f = new File(
    obj.id,
    obj.name,
    obj.size,
    new Date(obj.created),
    new Date(obj.updated),
  );

  return f;
};

const get_files = async (event, uow) => {
  const request = new GetFilesRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetFilesResponse) {
    uow.file_repository.reset_keeping_refs();
    response.data.forEach((obj) => {
      const f = convert_file_response_obj_to_model(obj);
      f.set_size_complete();
      uow.file_repository.set(f.id, f);
    })
    return;
  }

  throw new WrongResponseError();
};


const delete_file = async (event, uow) => {
  const request = new DeleteFileRequest({
    id: event.id,
  });
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof DeleteFileResponse) {
    uow.file_repository.delete(event.id);
    uow.push_message(new DeleteFileSuccess());
    return;
  }

  throw new WrongResponseError();
};

const rename_file = async (event, uow) => {
  const request = new RenameFileRequest({
    id: event.id,
    name: event.name,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof RenameFileResponse) {
    const f = convert_file_response_obj_to_model(response.data);
    f.set_size_complete();
    uow.file_repository.set(f.id, f);
    uow.push_message(new RenameFileSuccess());
    return;
  }

  throw new WrongResponseError();
};


const upload_file = async (event, uow) => {
  // Получаем ссылку на загрузку файла
  const request = new GetUploadLinkRequest({
    name: event.file.name,
    size: event.file.size,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }
  if (response instanceof GetUploadLinkResponse) {
    const f = convert_file_response_obj_to_model(response.data.file)
    uow.file_repository.set(f.id, f)

    uow.push_message(new UploadFileByLink(f.id, response.data.link, event.file));
    return;
  }

  throw new WrongResponseError();
};

const upload_file_by_link = async (event, uow) => {
  const file = uow.file_repository.get(event.id) //ref
  const request = new UploadFileRequest({
    link: event.link,
    original_file: event.file,
    on_progress: (x) => file.value.set_size(x)
  });

  let response = null;

  try {
    response = await uow.api.call(request);
  } catch (error) {
    uow.push_message(new UploadFileError(event.file.name));
    console.log(error);
  }

  if (response instanceof NegativeResponse) {
    uow.file_repository.delete(event.id);
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof UploadFileResponse) {
    // Если запрос успешен, то устанавливаем прогресс 100%
    uow.file_repository.set_size_complete(event.id);
    uow.push_message(new UploadFileSuccess());
    return;
  }

  uow.file_repository.delete(event.id);
  throw new WrongResponseError();
};

const download_file = async (event, uow) => {
  // Получаем ссылку на скачаивание файла
  const request = new GetDownloadLinkRequest({
    id: event.id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }
  if (response instanceof GetDownloadLinkResponse) {
    uow.push_message(new DownloadFileByLink(
      response.data.link, response.data.file.name, response.data.file.size));
    return;
  }

  throw new WrongResponseError();
};

const download_file_by_link = async (event, uow) => {
  const id = uuidv4();

  const file = new File(id, event.name, event.size, new Date(), new Date());
  console.log(file)
  uow.download_progress.set(id, file);

  const request = new DownloadFileRequest({
    set_size_method: (size) => uow.download_progress.set_size(id, size),
    link: event.link,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof DownloadFileResponse) {
    js_download_file({
      data: response.data.file,
      filename: event.name,
    });
    uow.push_message(new DownloadFileSuccess());
    return;
  }

  throw new WrongResponseError();
};

const convert_file_link_response_obj_to_model = (obj) => {
  const f = convert_file_response_obj_to_model(obj.file)
  const link = new ShareLink(
    obj.id,
    f,
    obj.is_secured,
    obj.expire_at ? new Date(obj.expire_at) : null,
    new Date(obj.created),
  );

  return link;
};

const add_file_share_link = async (event, uow) => {
  const request = new AddFileShareLinkRequest({
    id: event.id,
    lifetime: event.lifetime,
    password: event.password
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof AddFileShareLinkResponse) {
    const obj = convert_file_link_response_obj_to_model(response.data);
    uow.link_repository.set(obj.id, obj);
    return obj;
  }

  throw new WrongResponseError();
};

const get_file_share_links = async (event, uow) => {
  const request = new GetFileShareLinksRequest({
    file_id: event.file_id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetFileShareLinksResponse) {
    uow.link_repository.reset_keeping_refs();
    response.data.forEach((obj) => {
      const f = convert_file_link_response_obj_to_model(obj);
      uow.link_repository.set(f.id, f);
    })
    return;
  }

  throw new WrongResponseError();
};

const flush_file_share_links = async (event, uow) => {
    uow.link_repository.reset();
};

const get_file_share_link = async (event, uow) => {
  const request = new GetFileShareLinkRequest({
    file_id: event.file_id,
    link_id: event.link_id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetFileShareLinkResponse) {
    return convert_file_link_response_obj_to_model(response.data);
  }

  throw new WrongResponseError();
};

const delete_file_share_link = async (event, uow) => {
  const request = new DeleteFileShareLinkRequest({
    file_id: event.file_id,
    link_id: event.link_id,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof DeleteFileShareLinkResponse) {
    uow.link_repository.delete(event.link_id);
    uow.push_message(new FileShareLinkDeleted());
    return;
  }

  throw new WrongResponseError();
};

const download_file_by_file_share_link = async (event, uow) => {
  // Получаем ссылку на скачаивание файла
  const request = new GetDownloadLinkByFileShareLinkRequest({
    file_id: event.file_id,
    link_id: event.link_id,
    password: event.password,
  });

  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }
  if (response instanceof GetDownloadLinkByFileShareLinkResponse) {
    uow.push_message(new DownloadFileByLink(
      response.data.link, response.data.file.name, response.data.file.size));
    return;
  }

  throw new WrongResponseError();
};


export {
  upload_file,
  upload_file_by_link,
  get_files,
  delete_file,
  rename_file,
  download_file,
  download_file_by_link,
  add_file_share_link,
  get_file_share_links,
  flush_file_share_links,
  get_file_share_link,
  delete_file_share_link,
  download_file_by_file_share_link
};
