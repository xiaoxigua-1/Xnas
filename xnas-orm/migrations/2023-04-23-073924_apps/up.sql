-- Your SQL goes here
CREATE TABLE app (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  enable BOOLEAN NOT NULL DEFAULT TRUE,
  path TEXT NOT NULL
)