CREATE TABLE file_share_links
(
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files (id) ON DELETE CASCADE,
    password TEXT,
    expire_at TIMESTAMP,
    created TIMESTAMP NOT NULL
);
