PRAGMA foreign_keys = ON;

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    time_start DATETIME DEFAULT NULL,
    time_end DATETIME DEFAULT NULL,
    is_timed BOOLEAN DEFAULT FALSE,
    auto_start BOOLEAN DEFAULT FALSE,
    time_limit INTEGER DEFAULT 0,
    host INTEGER NOT NULL,
    current_category INTEGER DEFAULT NULL,
    all_categories BOOLEAN DEFAULT FALSE,
    current_language INT DEFAULT NULL,
    max_questions INTEGER DEFAULT 0,
    mode_id INTEGER NOT NULL,
    eliminate_on_fail BOOLEAN DEFAULT FALSE,
    password TEXT DEFAULT NULL,
    FOREIGN KEY (host) REFERENCES users(id),
    FOREIGN KEY (current_category) REFERENCES category(id),
    FOREIGN KEY (current_language) REFERENCES language(id)
);
