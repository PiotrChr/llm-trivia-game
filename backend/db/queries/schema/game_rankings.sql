PRAGMA foreign_keys = ON;

CREATE TABLE game_rankings (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    mode_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    questions_answered INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (mode_id) REFERENCES game_modes(id)
);