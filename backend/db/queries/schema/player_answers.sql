PRAGMA foreign_keys = ON;

CREATE TABLE player_answers (
    player_id INTEGER,
    question_id INTEGER,
    answer_id INTEGER DEFAULT NULL,
    game_id INTEGER,
    miss BOOLEAN DEFAULT 0,
    time INTEGER DEFAULT 0,
    PRIMARY KEY(player_id, question_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    FOREIGN KEY(answer_id) REFERENCES answers(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
);
