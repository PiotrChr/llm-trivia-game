PRAGMA foreign_keys = ON;

CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question_text TEXT NOT NULL,
    category INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    FOREIGN KEY (category) REFERENCES category(id)
);
