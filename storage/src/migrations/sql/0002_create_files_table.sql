CREATE TABLE files
(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    user_id UUID NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL,
    UNIQUE (name, user_id)
);

CREATE TABLE m2m_file_server
(
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files (id) ON DELETE CASCADE,
    server_id UUID REFERENCES servers (id) ON DELETE CASCADE,
    UNIQUE (file_id, server_id)
);