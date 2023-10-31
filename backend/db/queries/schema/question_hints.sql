PRAGMA foreign_keys = ON;

CREATE TABLE question_hints (
    id INTEGER PRIMARY KEY,
    question_id INTEGER NOT NULL,
    hint TEXT NOT NULL,
    language_id INTEGER NOT NULL,
    FOREIGN KEY(question_id) REFERENCES questions(id)
);