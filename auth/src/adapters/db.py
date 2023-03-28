import asyncpg
from src.tools.decorators import backoff


@backoff()
async def create_pool(**dsl):
    return await asyncpg.create_pool(**dsl)


async def get_conn_pool(**dsl):
    pool = await create_pool(**dsl)
    yield pool
    await pool.close()
