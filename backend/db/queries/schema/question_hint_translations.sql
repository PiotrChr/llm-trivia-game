PRAGMA foreign_keys = ON;

CREATE TABLE question_hint_translations (
    hint_id INTEGER,
    language_id INTEGER,
    hint_text TEXT NOT NULL,
    PRIMARY KEY(hint_id, language_id),
    FOREIGN KEY(hint_id) REFERENCES question_hints(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);
