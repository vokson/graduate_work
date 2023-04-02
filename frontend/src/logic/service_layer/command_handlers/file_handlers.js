import {
  NegativeResponse,
  GetFilesRequest,
  GetFilesResponse,
  UploadFileRequest,
  UploadFileResponse,
  // DownloadFileFromFolderRequest,
  // DownloadFileFromFolderResponse,
  // DownloadManyDocumentsFilesAsArchiveRequest,
  // DownloadManyDocumentsFilesAsArchiveResponse,
  // DownloadDocumentFilesAsArchiveRequest,
  // DownloadDocumentFilesAsArchiveResponse,
  // DeleteFileFromFolderRequest,
  // DeleteFileFromFolderResponse,
  // UpdateFileFromFolderRequest,
  // UpdateFileFromFolderResponse,
  // GetFileInfoRequest,
  // GetFileInfoResponse,
  // GetSpareFilesRequest,
  // GetSpareFilesResponse,
  // GetUploadProgressRequest,
  // GetUploadProgressResponse,
} from "../../adapters/api";

import {
  ApiError,
  UploadFileError,
  UploadFileSuccess,
  // FileUpdatedSuccess,
  // FileDeletedSuccess,
  // FileAttachedToDocument,
  // FileDetachedFromDocument,
  // FilesAllocated,
} from "../../domain/event";

import { File } from "../../domain/model";
// import { js_download_file } from "../utils/file_download";
// import { v4 as uuidv4 } from "uuid";

class WrongResponseError extends Error {}

const convert_file_response_obj_to_model = (obj) => {
  const user = new File(
    obj.id,
    obj.name,
    obj.size,
    obj.servers,
    obj.created,
    obj.updated,
    obj.size,
  );

  return user;
};

const get_files = async (event, uow) => {
  console.log('GET FILES', uow.api.get_auth_token());
  
  const request = new GetFilesRequest();
  const response = await uow.api.call(request);

  if (response instanceof NegativeResponse) {
    uow.push_message(new ApiError(response.data.code));
    return;
  }

  if (response instanceof GetFilesResponse) {
    uow.file_repository.reset_keeping_refs();
    response.data.forEach((obj) =>
      uow.file_repository.set(obj.id,
        convert_file_response_obj_to_model(obj)
      ))
    return;
  }

  throw new WrongResponseError();
};


const upload_file = async (event, uow) => {
  const file = new File(event.id, event.file.name, event.file.size);
  uow.file_repository.set(event.id, file);

  // Добавляем файл в таймер. Стартуем обновления процесса загрузки
  // uow.upload_progress_timer.add(event.file_id);

  const request = new UploadFileRequest({
    id: event.id,
    original_file: event.file,
  });

  let response = null;

  try {
    response = await uow.api.call(request);
  } catch (error) {
    uow.push_message(new UploadFileError(event.file.name));
    console.log(error);
  }

  // После завершения запроса удаляем файл из таймера
  // uow.upload_progress_timer.remove(event.file_id);

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

// const upload_file_to_folder = async (event, uow) => {
//   const file = new BaseFile(event.file_id, event.file.name, event.file.size);
//   uow.file_in_folder_repository.set(event.folder_id, event.file_id, file);
//   uow.file_common_repository.set(event.file_id, file);

//   // Добавляем файл в таймер. Стартуем обновления процесса загрузки
//   uow.upload_progress_timer.add(event.file_id);

//   const request = new UploadFileToFolderRequest({
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     id: event.file_id,
//     original_file: event.file,
//   });

//   let response = null;

//   try {
//     response = await uow.api.call(request);
//   } catch (error) {
//     uow.push_message(new UploadFileError(event.file.name));
//     console.log(error);
//   }

//   // После завершения запроса удаляем файл из таймера
//   uow.upload_progress_timer.remove(event.file_id);

//   if (response instanceof NegativeResponse) {
//     uow.file_in_folder_repository.delete(event.folder_id, event.file_id);
//     uow.file_common_repository.delete(event.file_id);
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof UploadFileToFolderResponse) {
//     // Если запрос успешен, то устанавливаем прогресс 100%
//     uow.file_common_repository.set_size_complete(event.file_id);
//     uow.push_message(new UploadFileSuccess());
//     return;
//   }

//   uow.file_in_folder_repository.delete(event.folder_id, event.file_id);
//   uow.file_common_repository.delete(event.file_id);
//   throw new WrongResponseError();
// };

// // OK
// const download_file_from_folder = async (event, uow) => {
//   const id = uuidv4();

//   const file = new BaseFile(id, event.name, event.size);
//   uow.download_progress.set(id, file);

//   const request = new DownloadFileFromFolderRequest({
//     set_size_method: (size) => uow.download_progress.set_size(id, size),
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     id: event.file_id,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DownloadFileFromFolderResponse) {
//     js_download_file({
//       data: response.data.file,
//       filename: response.data.name,
//       inline: event.inline,
//     });
//     return;
//   }

//   throw new WrongResponseError();
// };

// const download_many_documents_files_as_archive = async (event, uow) => {
//   const id = uuidv4();

//   const file = new BaseFile(id, "AAAAA", event.size);
//   uow.download_progress.set(id, file);

//   const request = new DownloadManyDocumentsFilesAsArchiveRequest({
//     set_size_method: (size) => uow.download_progress.set_size(id, size),
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     document_ids: event.document_ids,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DownloadManyDocumentsFilesAsArchiveResponse) {
//     js_download_file({
//       data: response.data.file,
//       filename: response.data.name,
//     });
//     return;
//   }

//   throw new WrongResponseError();
// };

// const download_document_files_as_archive = async (event, uow) => {
//   const id = uuidv4();

//   const file = new BaseFile(id, "AAAAA", event.size);
//   uow.download_progress.set(id, file);

//   const request = new DownloadDocumentFilesAsArchiveRequest({
//     set_size_method: (size) => uow.download_progress.set_size(id, size),
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     document_id: event.document_id,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof DownloadDocumentFilesAsArchiveResponse) {
//     js_download_file({
//       data: response.data.file,
//       filename: response.data.name,
//     });
//     return;
//   }

//   throw new WrongResponseError();
// };

// const get_file_info = async (event, uow) => {
//   const request = new GetFileInfoRequest({
//     id: event.file_id,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetFileInfoResponse) return response.data;

//   throw new WrongResponseError();
// };

// const delete_file_from_folder = async (event, uow) => {
//   const delete_file_func = () => {
//     // Удаляем файл из нераспределнных файлов папки
//     uow.file_in_folder_repository.delete(event.folder_id, event.file_id);
//     // Удаляем файл из общего хранилища файлов
//     uow.file_common_repository.delete(event.file_id);

//     uow.push_message(new FileDeletedSuccess());
//   };

//   // Если файл прикреплен к другим документам в этой же папке, группе пользователей
//   // все равно его удаляем
//   if (uow.doc_repository.file_in_repository(event.folder_id, event.file_id)) {
//     delete_file_func();
//     return;
//   }

//   const request = new DeleteFileFromFolderRequest({
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     id: event.file_id,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   // Если файл прикреплен к другим документам в этой же папке, группе пользователей
//   // все равно его удаляем
//   if (response instanceof DeleteFileFromFolderResponse) {
//     delete_file_func();
//     return;
//   }

//   throw new WrongResponseError();
// };

// const update_file_from_folder = async (event, uow) => {
//   const request = new UpdateFileFromFolderRequest({
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//     id: event.file_id,
//     name: event.name,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof UpdateFileFromFolderResponse) {
//     const file = uow.file_common_repository.get(
//       event.file_id
//     ); // Ref
//     file.value.rename(response.data.name);
//     uow.push_message(new FileUpdatedSuccess());
//     return;
//   }

//   throw new WrongResponseError();
// };

// const flush_file_container = (event, uow) => {
//   uow.file_in_folder_repository
//     .pure_keys(event.folder_id)
//     .forEach((file_id) =>
//       uow.push_message(
//         new DeleteFileFromFolder(event.folder_id, event.usergroup_id, file_id)
//       )
//     );
// };

// const get_spare_files = async (event, uow) => {
//   uow.file_in_folder_repository.reset(event.folder_id);

//   const request = new GetSpareFilesRequest({
//     folder_id: event.folder_id,
//     usergroup_id: event.usergroup_id,
//   });

//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetSpareFilesResponse) {
//     response.data.forEach((obj) => {
//       const base_file = new BaseFile(obj.id, obj.name, obj.size);
//       base_file.set_size(obj.size);
//       // Добавляем файл в хранилище нераспределенных файлов папки
//       uow.file_in_folder_repository.set(event.folder_id, obj.id, base_file);
//       // Добавляем файл в общее хранилище файлов
//       uow.file_common_repository.set(obj.id, base_file);
//     });
//     return;
//   }

//   throw new WrongResponseError();
// };

// const update_upload_progress = async (event, uow) => {
//   const request = new GetUploadProgressRequest({});
//   const response = await uow.api.call(request);

//   if (response instanceof NegativeResponse) {
//     uow.push_message(new ApiError(response.data.code));
//     return;
//   }

//   if (response instanceof GetUploadProgressResponse) {
//     response.data.forEach((obj) => {
//       uow.file_common_repository.set_size(obj.file_id, obj.loaded);
//     });
//     return;
//   }

//   throw new WrongResponseError();
// };

// const download_excel_file = async (event) => {
//   // https://redstapler.co/sheetjs-tutorial-create-xlsx/

//   function s2ab(s) {
//     var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
//     var view = new Uint8Array(buf); //create uint8array as viewer
//     for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
//     return buf;
//   }

//   const ws = XLSX.utils.aoa_to_sheet(event.aoa);

//   const wb = XLSX.utils.book_new();
//   wb.SheetNames.push("Sheet");
//   wb.Sheets["Sheet"] = ws;

//   var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

//   js_download_file({
//     data: new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
//     filename: event.filename,
//   });
// };

// const download_json_file = async (event) => {
//   js_download_file({
//     data: new Blob([JSON.stringify(event.data)]),
//     mime: "application/octet-stream",
//     filename: event.filename,
//   });
// };

// const attach_file_to_document = (event, uow) => {
//   const file = uow.file_in_folder_repository.get_file(
//     event.folder_id,
//     event.file_id
//   );

//   if (!file) {
//     console.log("Error during attaching of file");
//     return;
//   }

//   uow.doc_repository.add_file(event.folder_id, event.document_id, file);
//   uow.doc_repository.mark_as_modified(event.folder_id, event.document_id);
//   uow.file_in_folder_repository.delete(event.folder_id, event.file_id);

//   // Отравляем событие о том, что файл добавлен
//   uow.push_message(
//     new FileAttachedToDocument(
//       event.folder_id,
//       event.usergroup_id,
//       event.document_id,
//       event.file_id
//     )
//   );
// };

// const detach_file_from_document = (event, uow) => {
//   const file = uow.doc_repository.get_file(
//     event.folder_id,
//     event.document_id,
//     event.file_id
//   );

//   if (!file) {
//     console.log("Error during detaching of file");
//     return;
//   }

//   uow.file_in_folder_repository.set(event.folder_id, event.file_id, file);
//   uow.doc_repository.remove_file(
//     event.folder_id,
//     event.document_id,
//     event.file_id
//   );
//   uow.doc_repository.mark_as_modified(event.folder_id, event.document_id);

//   // Отравляем событие о том, что файл удален
//   uow.push_message(
//     new FileDetachedFromDocument(
//       event.folder_id,
//       event.usergroup_id,
//       event.document_id,
//       event.file_id
//     )
//   );
// };

// const attach_files_to_document_using_pattern = (event, uow) => {
//   const attributes = uow.doc_repository.attributes(
//     event.folder_id,
//     event.document_id
//   );

//   const filename_pattern = uow.folder_repository.get_filename_pattern(
//     event.folder_id,
//     attributes
//   );

//   if (filename_pattern === null || filename_pattern == "") return;

//   const regexp = new RegExp(filename_pattern);
//   const base_files_ids = uow.file_in_folder_repository.pure_keys(
//     event.folder_id
//   );

//   base_files_ids.forEach((file_id) => {
//     const file = uow.file_in_folder_repository.get_file(
//       event.folder_id,
//       file_id
//     );

//     // Если файл еще не загружен, исключаем его из распределения
//     if (!file.uploaded) return;

//     // Проверяем имя файла на совпадение с шаблоном
//     if (file.name.match(regexp) !== null)
//       uow.push_message(
//         new AttachFileToDocument(
//           event.folder_id,
//           event.usergroup_id,
//           event.document_id,
//           file_id
//         )
//       );
//   });
// };

// const allocate_files_to_documents_using_pattern = (event, uow) => {
//   const doc_ids = uow.doc_repository.pure_keys(event.folder_id);
//   doc_ids.forEach((id) => {
//     // Если документ не заблокирован, он участвует в распределении файлов
//     if (!uow.doc_repository.is_blocked(event.folder_id, id))
//       uow.push_message(
//         new AttachFilesToDocumentUsingPattern(
//           event.folder_id,
//           event.usergroup_id,
//           id
//         )
//       );
//   });

//   uow.push_message(new FilesAllocated());
// };

export {
  upload_file,
  get_files,
//   upload_file_to_folder,
//   download_file_from_folder,
//   download_many_documents_files_as_archive,
//   download_document_files_as_archive,
//   get_file_info,
//   delete_file_from_folder,
//   update_file_from_folder,
//   flush_file_container,
//   get_spare_files,
//   update_upload_progress,
//   download_excel_file,
//   download_json_file,
//   attach_file_to_document,
//   detach_file_from_document,
//   attach_files_to_document_using_pattern,
//   allocate_files_to_documents_using_pattern,
};
