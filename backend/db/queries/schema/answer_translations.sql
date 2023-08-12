PRAGMA foreign_keys = ON;

CREATE TABLE answer_translations (
    answer_id INTEGER,
    language_id INTEGER,
    answer_text TEXT NOT NULL,
    PRIMARY KEY(answer_id, language_id),
    FOREIGN KEY(answer_id) REFERENCES answers(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);
