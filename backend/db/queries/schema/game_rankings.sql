PRAGMA foreign_keys = ON;

CREATE TABLE game_rankings (
    id INTEGER PRIMARY KEY,
    game_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    mode_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (mode_id) REFERENCES game_modes(id)
);