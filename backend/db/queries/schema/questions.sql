PRAGMA foreign_keys = ON;

CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    category TEXT NOT NULL
);
