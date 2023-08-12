PRAGMA foreign_keys = ON;

CREATE TABLE category_translations (
    category_id INTEGER,
    language_id INTEGER,
    category_name TEXT NOT NULL,
    PRIMARY KEY(category_id, language_id),
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);
