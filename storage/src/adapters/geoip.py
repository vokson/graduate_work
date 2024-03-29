"""Модуль для работы с S3 Storage."""

import logging
from abc import ABC, abstractmethod

import geocoder

logger = logging.getLogger(__name__)


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


geoip: AbstractGeoIpService | None = None


async def init_geo_ip():
    global geoip

    if not geoip:
        logger.info("Initialization of geo IP service ..")
        geoip = GeoCoderIpService()
        logger.info("Geo IP service has been initialized.")

    return geoip
