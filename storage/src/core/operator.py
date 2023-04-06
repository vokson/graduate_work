import asyncio
import logging
from abc import ABC, abstractmethod

from src.tools.delay import DelayCalculator


logger = logging.getLogger(__name__)


class AbstractAsyncOperator(ABC):
    def __init__(self, delay_calculator=DelayCalculator(limit=5)):
        self._delay_calculator = delay_calculator

    async def run(self):
        while True:
            try:
                await self._do()
            except Exception as e:
                logger.error("Error in operator during running")
                logger.info(e)

            sleep_time = self._delay_calculator.get()
            logger.info(f"Sleeping {sleep_time} seconds.")
            await asyncio.sleep(sleep_time)

    @abstractmethod
    async def _do(self):
        pass
