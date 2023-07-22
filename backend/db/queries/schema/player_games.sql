PRAGMA foreign_keys = ON;

CREATE TABLE player_games (
    player_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(player_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
)