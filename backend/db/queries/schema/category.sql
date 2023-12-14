PRAGMA foreign_keys = ON;

CREATE TABLE category (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    time_added INTEGER NOT NULL default CURRENT_TIMESTAMP
);