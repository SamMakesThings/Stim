CREATE DATABASE STIM;
\c STIM;

CREATE TABLE relevance (
    id SERIAL PRIMARY KEY,
    -- Add other columns as needed, e.g.,:
    concept TEXT,
    message_ids TEXT,
    relevance TEXT
);
