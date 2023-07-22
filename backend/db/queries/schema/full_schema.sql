PRAGMA foreign_keys = ON;

CREATE TABLE answers (
    id INTEGER PRIMARY KEY,
    question_id INTEGER NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    time_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_end DATETIME DEFAULT NULL,
    is_timed BOOLEAN DEFAULT FALSE,
    time_limit INTEGER DEFAULT NULL,
);

CREATE TABLE players (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    google_id TEXT DEFAULT NULL, -- for future Google Authentication
    total_score INTEGER DEFAULT 0,
    password TEXT NOT NULL
);

CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE game_questions (
    question_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(game_id, question_id),
    FOREIGN KEY(game_id) REFERENCES games(id)
    FOREIGN KEY(question_id) REFERENCES questions(id)
)

CREATE TABLE player_games (
    player_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(player_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
)

CREATE TABLE player_answers (
    player_id INTEGER,
    question_id INTEGER,
    answer_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(player_id, question_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    FOREIGN KEY(answer_id) REFERENCES answers(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
);
