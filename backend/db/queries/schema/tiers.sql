PRAGMA foreign_keys = ON;

CREATE TABLE tiers (
    id INTEGER PRIMARY KEY,
    rank_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL,
    max_points INTEGER NOT NULL,
    FOREIGN KEY(rank_type_id) REFERENCES rank_types(id)
);