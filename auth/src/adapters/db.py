import asyncpg

# from tools.decorators import backoff

# @backoff()
async def startup(self, *args, **kwargs):
    return await asyncpg.create_pool(**kwargs)

async def get_conn_pool(**dsl):
    pool = startup(**dsl)
    yield pool
    await pool.close()