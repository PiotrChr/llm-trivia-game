PRAGMA foreign_keys = ON;

CREATE TABLE question_submission (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    answers TEXT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);