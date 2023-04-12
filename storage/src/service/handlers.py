from asyncpg.exceptions import (InterfaceError, PostgresError,
                                UniqueViolationError)

from src.core import exceptions
from src.domain import command_results, commands, events
from src.service import command_handlers, event_handlers

EVENT_HANDLERS = {
    events.CdnServerUpdated: [event_handlers.cdn_server_updated],
    events.FileStored: [event_handlers.file_stored],
    events.FileRemovedFromStorage: [event_handlers.file_removed_from_storage],
    events.FileDownloadedToTempStorage: [
        event_handlers.file_downloaded_to_temp_storage,
    ],
    events.FileDistributed: [event_handlers.file_distributed],
    events.FileDeleted: [event_handlers.file_deleted],
}

COMMAND_HANDLERS = {
    commands.GetManyCdnServers: command_handlers.get_many_cdn_servers,
    commands.CreateCdnServer: command_handlers.create_cdn_server,
    commands.UpdateCdnServer: command_handlers.update_cdn_server,
    commands.DeleteCdnServer: command_handlers.delete_cdn_server,
    commands.EnrichCdnServerByFiles: command_handlers.enrich_cdn_server_by_files,  # noqa
    commands.DeleteFile: command_handlers.delete_file,
    commands.RenameFile: command_handlers.rename_file,
    commands.GetManyFiles: command_handlers.get_many_files,
    commands.GetFileServers: command_handlers.get_file_servers,
    commands.GetUploadLink: command_handlers.get_upload_link,
    commands.GetDownloadLink: command_handlers.get_download_link,
    commands.GetUserActions: command_handlers.get_user_actions,
    commands.HandleS3Event: command_handlers.handle_s3_event,
    commands.HandleServiceEvent: command_handlers.handle_service_event,
    commands.MarkFileAsStored: command_handlers.mark_file_as_stored,
    commands.OrderFileToCopy: command_handlers.order_file_to_copy,
    commands.OrderFileToDownload: command_handlers.order_file_to_download,
    commands.DownloadFileToTempStorage: command_handlers.download_file_to_temp_storage,  # noqa
    commands.PublishMessage: command_handlers.publish_message,
    commands.CopyFile: command_handlers.copy_file,
    commands.DistributeFileWithinZone: command_handlers.distribute_file_within_zone,  # noqa
    commands.RemoveFileFromTempStorage: command_handlers.remove_file_from_temp_storage,  # noqa
    commands.OrderFileToRemove: command_handlers.order_file_to_remove,
    commands.RemoveFile: command_handlers.remove_file,
    commands.MarkFileAsRemoved: command_handlers.mark_file_as_removed,
    commands.CreateFileShareLink: command_handlers.create_file_share_link,
    commands.GetFileShareLinks: command_handlers.get_file_share_links,
    commands.GetFileShareLink: command_handlers.get_file_share_link,
    commands.DeleteFileShareLink: command_handlers.delete_file_share_link,
    commands.ValidateFileShareLink: command_handlers.validate_file_share_link,
}

RESULTS = {
    PostgresError: command_results.DatabaseError,
    InterfaceError: command_results.DatabaseError,
    UniqueViolationError: command_results.UniqueViolationDatabaseError,
    exceptions.AuthNoPermissionException: command_results.AuthNoPermissionException,  # noqa
    exceptions.FileDoesNotExist: command_results.FileDoesNotExist,
    exceptions.FileAlreadyExists: command_results.FileAlreadyExists,
    exceptions.FileShareLinkDoesNotExist: command_results.FileShareLinkDoesNotExist,  # noqa
    exceptions.CdnServerAlreadyExists: command_results.CdnServerAlreadyExists,
    exceptions.BadS3Event: command_results.BadS3Event,
    exceptions.BadServiceEvent: command_results.BadServiceEvent,
    exceptions.PublishMessageError: command_results.PublishMessageError,
    exceptions.DownloadFileError: command_results.DownloadFileError,
    exceptions.UploadFileError: command_results.UploadFileError,
    exceptions.FileNotFoundInTempStorage: command_results.FileNotFoundInTempStorage,  # noqa
    exceptions.RemoveFileError: command_results.RemoveFileError,
    exceptions.CdnServerConnectionError: command_results.CdnServerConnectionError,  # noqa
}
