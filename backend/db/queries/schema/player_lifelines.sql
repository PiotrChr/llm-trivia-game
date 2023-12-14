PRAGMA foreign_keys = ON;

CREATE TABLE player_lifelines (
    player_id INTEGER,
    lifeline_id INTEGER,
    game_id INTEGER,
    question_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(player_id, lifeline_id, created_at),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(lifeline_id) REFERENCES lifeline_types(id)
    FOREIGN KEY(game_id) REFERENCES games(id)
    FOREIGN KEY(question_id) REFERENCES questions(id)
);