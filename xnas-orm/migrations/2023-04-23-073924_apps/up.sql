-- Your SQL goes here
CREATE TABLE apps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  enable BOOLEAN NOT NULL DEFAULT TRUE,
  path TEXT NOT NULL
)
