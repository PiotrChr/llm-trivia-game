PRAGMA foreign_keys = ON;

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    time_start DATETIME DEFAULT NULL,
    time_end DATETIME DEFAULT NULL,
    is_timed BOOLEAN DEFAULT FALSE,
    auto_start BOOLEAN DEFAULT FALSE,
    time_limit INTEGER DEFAULT NULL,
    host INTEGER NOT NULL,
    current_category INTEGER DEFAULT NULL,
    current_language TEXT DEFAULT NULL,
    max_questions INTEGER DEFAULT NULL,
    password TEXT DEFAULT NULL,
    FOREIGN KEY (host) REFERENCES users(id),
    FOREIGN KEY (current_category) REFERENCES category(id),
    FOREIGN KEY (current_language) REFERENCES language(id)
);
