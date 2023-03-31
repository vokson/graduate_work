CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE servers
(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE files
(
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    size integer,
    created TIMESTAMP,
    updated TIMESTAMP
);

CREATE TABLE m2m_file_server
(
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files (id),
    server_id UUID REFERENCES servers (id),
    UNIQUE (file_id, server_id)
);