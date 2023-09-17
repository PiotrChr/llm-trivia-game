PRAGMA foreign_keys = ON;

CREATE TABLE notification_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);