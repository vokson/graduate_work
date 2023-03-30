FROM nginx:1.23.1

WORKDIR /cert
COPY ./cert/device.key .
COPY ./cert/device.crt .
WORKDIR /frontend
COPY ./src/frontend/dist .