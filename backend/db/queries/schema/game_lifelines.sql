PRAGMA foreign_keys = ON;

CREATE TABLE game_lifelines (
    game_id INTEGER,
    lifeline_id INTEGER,
    count INTEGER NOT NULL,
    PRIMARY KEY(game_id, lifeline_id),
    FOREIGN KEY(game_id) REFERENCES games(id),
    FOREIGN KEY(lifeline_id) REFERENCES lifeline_types(id)
);