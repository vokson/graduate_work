CREATE TABLE users
(
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE,
    created TIMESTAMP,
    updated TIMESTAMP
);