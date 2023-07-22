PRAGMA foreign_keys = ON;

CREATE TABLE game_questions (
    question_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(game_id, question_id),
    FOREIGN KEY(game_id) REFERENCES games(id)
    FOREIGN KEY(question_id) REFERENCES questions(id)
)