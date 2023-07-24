PRAGMA foreign_keys = ON;

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    time_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_end DATETIME DEFAULT NULL,
    is_timed BOOLEAN DEFAULT FALSE,
    time_limit INTEGER DEFAULT NULL,
    host INTEGER NOT NULL,
    current_category INTEGER DEFAULT NULL,
    max_questions INTEGER DEFAULT NULL,
    password TEXT NOT NULL,
    FOREIGN KEY (host) REFERENCES users(id),
    FOREIGN KEY (current_category) REFERENCES category(id)
);
