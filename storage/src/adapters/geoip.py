"""Модуль для работы с S3 Storage."""
from abc import ABC, abstractmethod
from contextlib import asynccontextmanager

import geocoder
from src.tools.decorators import backoff


class AbstractGeoIpService(ABC):
    @staticmethod
    @abstractmethod
    async def get_info(ip: str) -> tuple[float, float]:
        pass


class GeoCoderIpService(AbstractGeoIpService):
    @staticmethod
    async def get_info(ip: str) -> tuple[float, float]:
        try:
            g = geocoder.ip(ip)

        except Exception as e:
            logger.error(f"Error during geo location of IP {ip}")
            logger.info(e)
            return

        if not g.ok:
            return

        if not g.json["ok"]:
            return


        return g.latlng


async def get_geo_ip_service():
    return GeoCoderIpService()
