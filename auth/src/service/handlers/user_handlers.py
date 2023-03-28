import logging
from datetime import datetime
from uuid import uuid4
from asyncpg.exceptions import PostgresError

from src.core import exceptions
from src.domain import command_results, commands, events
from src.domain.models.user import User
from src.service.uow import AbstractUnitOfWork


logger = logging.getLogger(__name__)


async def create_user(
    cmd: commands.CreateUser,
    uow: AbstractUnitOfWork,
):
    async with uow:
        user = await uow.users.get_by_username(cmd.username)

        if user:
            raise exceptions.UserAlreadyExists

        user = User(
            id=uuid4(),
            username=cmd.username,
            password=cmd.password,
            email=cmd.email,
            first_name=cmd.first_name,
            last_name=cmd.last_name,
            is_superuser=False,
            created=datetime.now(),
        )

        await uow.users.add(user)
        await uow.commit()

    return command_results.PositiveCommandResult(user.dict())


# def add_batch(
#     cmd: commands.CreateBatch,
#     uow: unit_of_work.AbstractUnitOfWork,
# ):
#     with uow:
#         product = uow.products.get(sku=cmd.sku)
#         if product is None:
#             product = model.Product(cmd.sku, batches=[])
#             uow.products.add(product)
#         product.batches.append(model.Batch(cmd.ref, cmd.sku, cmd.qty, cmd.eta))
#         uow.commit()


# def allocate(
#     cmd: commands.Allocate,
#     uow: unit_of_work.AbstractUnitOfWork,
# ) -> str:
#     line = OrderLine(cmd.orderid, cmd.sku, cmd.qty)
#     with uow:
#         product = uow.products.get(sku=line.sku)
#         if product is None:
#             raise InvalidSku(f"Invalid sku {line.sku}")
#         batchref = product.allocate(line)
#         uow.commit()
#         return batchref


# def change_batch_quantity(
#     cmd: commands.ChangeBatchQuantity,
#     uow: unit_of_work.AbstractUnitOfWork,
# ):
#     with uow:
#         product = uow.products.get_by_batchref(batchref=cmd.ref)
#         product.change_batch_quantity(ref=cmd.ref, qty=cmd.qty)
#         uow.commit()


# # pylint: disable=unused-argument


# def send_out_of_stock_notification(
#     event: events.OutOfStock,
#     uow: unit_of_work.AbstractUnitOfWork,
# ):
#     email.send(
#         "stock@made.com",
#         f"Out of stock for {event.sku}",
#     )


# def publish_allocated_event(
#     event: events.Allocated,
#     uow: unit_of_work.AbstractUnitOfWork,
# ):
#     redis_eventpublisher.publish("line_allocated", event)
