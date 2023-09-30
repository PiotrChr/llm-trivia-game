PRAGMA foreign_keys = ON;

CREATE TABLE game_modes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);