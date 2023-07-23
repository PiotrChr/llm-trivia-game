PRAGMA foreign_keys = ON;

CREATE TABLE players (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    google_id TEXT DEFAULT NULL, -- for future Google Authentication
    total_score INTEGER DEFAULT 0,
    password TEXT NOT NULL
);