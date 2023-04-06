import asyncio
import logging
import time
from collections import deque
from datetime import datetime
from uuid import UUID, uuid4

import jwt
from asyncpg.exceptions import PostgresError
from src.adapters.s3 import AbstractS3Storage
from src.core import exceptions
from src.core.config import settings
from src.domain import command_results, commands, events
from src.domain.models import (BrokerMessage, CdnServer, File,
                               FileStoredBrokerMessage)
from src.service.uow import AbstractUnitOfWork


logger = logging.getLogger(__name__)


async def create_cdn_server(
    cmd: commands.CreateCdnServer,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.cdn_servers.get_by_name(cmd.name)

        if obj:
            raise exceptions.CdnServerAlreadyExists

        obj = CdnServer(
            id=uuid4(),
            name=cmd.name,
            host=cmd.host,
            port=cmd.port,
            location=cmd.location,
            latitude=cmd.latitude,
            longitude=cmd.longitude,
        )

        await uow.cdn_servers.add(obj)
        await uow.commit()

    return command_results.PositiveCommandResult(obj.dict())


async def get_many_cdn_servers(
    cmd: commands.GetManyCdnServers,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.cdn_servers.get_all()

    return command_results.PositiveCommandResult([x.dict() for x in objs])


# async def create_file(
#     cmd: commands.CreateFile,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         obj = File(
#             id=uuid4(),
#             name=cmd.name,
#             size=cmd.size,
#             servers=cmd.servers
#         )

#         await uow.files.add(obj)
#         await uow.commit()

#     return command_results.PositiveCommandResult(obj.dict())


async def get_many_files(
    cmd: commands.GetManyFiles,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = await uow.files.get_all(cmd.user_id)

    return command_results.PositiveCommandResult(objs)


async def delete_file(
    cmd: commands.DeleteFile,
    uow: AbstractUnitOfWork,
):
    async with uow:
        obj = await uow.files.get_by_id(cmd.id)
        if not obj:
            raise exceptions.FileDoesNotExist

        if obj.user_id != cmd.user_id:
            raise exceptions.FileDoesNotExist

        await uow.files.delete(cmd.id)
        await uow.commit()

    return command_results.PositiveCommandResult({})


async def get_file_servers(
    cmd: commands.GetFileServers,
    uow: AbstractUnitOfWork,
):
    async with uow:
        objs = []
        ids_of_servers = await uow.files.get_ids_of_servers(cmd.id)

        if ids_of_servers:
            servers = await uow.cdn_servers.get_all()
            objs = [x for x in servers if x.id in ids_of_servers]

    return command_results.PositiveCommandResult(objs)


async def get_upload_link(
    cmd: commands.GetUploadLink,
    uow: AbstractUnitOfWork,
):
    async with uow:
        coordinates = await uow.geoip.get_info(cmd.ip)
        nearest_server = await uow.cdn_servers.get_nearest(coordinates)
        logger.info(
            f"Get upload link for file {cmd.name} on server {nearest_server.name}"
        )

        obj = await uow.files.get_by_name_and_user_id(cmd.name, cmd.user_id)
        is_new = False if obj else True

        dt = datetime.now()

        if is_new:
            obj = File(
                id=uuid4(),
                name=cmd.name,
                size=cmd.size,
                user_id=cmd.user_id,
                created=dt,
                updated=dt,
            )
            await uow.files.add(obj)

        else:
            obj.size = cmd.size
            obj.updated = dt
            await uow.files.update(obj)

        storage = await uow.s3_pool.get(
            nearest_server.name, nearest_server.host, nearest_server.port
        )
        link = await storage.get_upload_url(str(obj.id))

        await uow.commit()

    return command_results.PositiveCommandResult({"file": obj, "link": link})


async def publish_message(
    uow: AbstractUnitOfWork, broker_message: BrokerMessage
):
    is_ok = False
    try:
        is_ok = await uow.publisher.push_message(
            broker_message.app, broker_message.key, broker_message.message
        )

    except Exception:
        pass

    finally:
        if is_ok:
            logger.info(
                f"Message {broker_message.message} with key {broker_message.key} has been published"
            )

        else:
            logger.error(
                f"Error when publish message {broker_message.message} with key {broker_message.key}"
            )

    return is_ok


# async def collect_storage_events(
#     cmd: commands.CollectStorageEvents,
#     uow: AbstractUnitOfWork,
# ):
#     async with uow:
#         servers = await uow.cdn_servers.get_all()
#         storages = []
#         for x in servers:
#             try:
#                 storages.append(await uow.s3_pool.get(x.name, x.host, x.port))
#             except Exception:
#                 logger.error(f'Storage {x.name} is not available at {x.host}:{x.port}')


#         async def listen_storage(storage: AbstractS3Storage):
#             queue = deque([])
#             count = 0
#             # try:
#             #     filename = await asyncio.wait_for(anext(storage.get_created_events()), timeout=5)
#             async for filename in storage.get_created_events():
#                 logger.info(f'Created file "{x}" on server {storage.name}')
#                 message = FileStoredBrokerMessage(message={
#                     "id": filename,
#                     "storage": storage.name
#                 })
#                 queue.append(message)

#                 while len(queue) > 0:
#                     message = queue.popleft()
#                     is_ok = await publish_message(uow, message)
#                     if not is_ok:
#                         queue.append(message)
#                         asyncio.sleep(1)
#                     else:
#                         count += 1

#             # except Exception as e:
#             #     print('&&&&&&&&&&&&&&&&')
#             #     print(e)

#             return count

#         listeners = [asyncio.create_task(listen_storage(x)) for x in storages]

#         # await asyncio.wait(listeners)
#             # done, pending = await asyncio.wait(listeners, timeout=3)
#         results = await asyncio.gather(*listeners)

#         total_count = 0
#         for x in results:
#             if type(x) is int:
#                 total_count += x
#             # print('***************')
#             # print(done, pending)
#             # for task in pending:
#             #     print('@@@@@@@')
#             #     task.cancel()
#             #     print(f'Task cancelled - {task.cancelled()}')

#         # except asyncio.TimeoutError:
#         #     logger.info('Timeout Exception')

#         # except asyncio.CancelledError:
#         #     print(f'Cancel task')


#     return command_results.PositiveCommandResult({"done": total_count})


async def handle_s3_event(
    cmd: commands.HandleS3Event,
    uow: AbstractUnitOfWork,
):
    # print(cmd.routing_key, cmd.body)

    async with uow:
        try:
            storage_name = cmd.routing_key.split(".", 2)[1]
            event_name = cmd.body["EventName"]
            action = event_name.split(":", 2)[1]
            key = cmd.body["Key"].split("/", 1)[1]

        except Exception as e:
            logger.error(f"Error during parsing of S3 event {cmd.body}")
            logger.info(e)
            raise exceptions.BadS3Event

        events_mapping = {
            "ObjectCreated": events.FileStored,
            "ObjectRemoved": events.FileRemovedFromStorage,
        }

        if action not in events_mapping:
            raise exceptions.BadS3Event

        uow.push_message(
            events_mapping[action](id=key, storage_name=storage_name)
        )

    return command_results.PositiveCommandResult({})

async def mark_file_as_stored(
    cmd: commands.MarkFileAsStored,
    uow: AbstractUnitOfWork,
):
    async with uow:
        await uow.files.add_server_to_file(cmd.file_id, cmd.server_id)
        await uow.commit()

    return command_results.PositiveCommandResult({})

async def order_file_to_copy(
    cmd: commands.OrderFileToCopy,
    uow: AbstractUnitOfWork,
):
    print('ORDER TO COPY', cmd.file_id, cmd.from_server_id, cmd.to_server_id)
    return command_results.PositiveCommandResult({})