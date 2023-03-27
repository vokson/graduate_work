# from __future__ import annotations
# from typing import TYPE_CHECKING
# from allocation.adapters import email, redis_eventpublisher
# from allocation.domain.model import OrderLine
from src.domain import commands, events
from src.domain.models.user import User
from src.service.uow import AbstractUnitOfWork


# if TYPE_CHECKING:
#     from . import unit_of_work


# class InvalidSku(Exception):
#     pass


async def create_user(
    cmd: commands.CreateUser,
    uow: AbstractUnitOfWork,
):
    async with uow:
        user = await uow.users.get_by_username(cmd.username)

        if user is None:
            user = User(username=cmd.username, password=cmd.password)
            await uow.users.add(user)

        await uow.commit()


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
