CREATE TABLE permissions
(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expire_at integer,
    refresh_token_expire_at  integer,
    created TIMESTAMP,
    updated TIMESTAMP
);

CREATE TABLE user_permissions
(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (id),
    permission_id UUID REFERENCES permissions (id),
    UNIQUE (user_id, permission_id)
);