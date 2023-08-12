PRAGMA foreign_keys = ON;

CREATE TABLE question_translations (
    question_id INTEGER,
    language_id INTEGER,
    question_text TEXT NOT NULL,
    PRIMARY KEY(question_id, language_id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);
