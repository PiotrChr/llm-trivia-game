PRAGMA foreign_keys = ON;

CREATE TABLE question_difficulty_ranking (
    player_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id)
)