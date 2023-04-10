CREATE TABLE history
(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    obj_id UUID NOT NULL,
    event TEXT NOT NULL, 
    data jsonb NOT NULL,
    created TIMESTAMP NOT NULL
);
