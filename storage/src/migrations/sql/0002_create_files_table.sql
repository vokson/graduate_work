CREATE TABLE files
(
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    size integer,
    user_id UUID,
    created TIMESTAMP,
    updated TIMESTAMP,
    UNIQUE (name, user_id)
);

CREATE TABLE m2m_file_server
(
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files (id) ON DELETE CASCADE,
    server_id UUID REFERENCES servers (id) ON DELETE CASCADE,
    UNIQUE (file_id, server_id)
);