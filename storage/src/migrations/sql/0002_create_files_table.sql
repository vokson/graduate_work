CREATE TABLE files
(
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    size INTEGER,
    user_id UUID,
    has_deleted BOOLEAN NOT NULL DEFAULT false,
    created TIMESTAMP,
    updated TIMESTAMP,
    UNIQUE (name, user_id)
);

CREATE INDEX idx_deleted ON files (has_deleted);

CREATE TABLE m2m_file_server
(
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files (id) ON DELETE CASCADE,
    server_id UUID REFERENCES servers (id) ON DELETE CASCADE,
    UNIQUE (file_id, server_id)
);