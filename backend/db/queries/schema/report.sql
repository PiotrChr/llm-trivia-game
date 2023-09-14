PRAGMA foreign_keys = ON;

CREATE TABLE report (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    report_type INTEGER NOT NULL,
    report TEXT NOT NULL,
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(question_id) REFERENCES questions(id)
    FOREIGN KEY(report_type) REFERENCES report_types(id)
)