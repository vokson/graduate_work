import asyncpg

# from tools.decorators import backoff


# @backoff()
async def get_conn_pool(**dsl):
    pool = await asyncpg.create_pool(**dsl)
    yield pool
    await pool.close()
