PRAGMA foreign_keys = ON;

CREATE TABLE player_badges (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(badge_id) REFERENCES badges(id)
);
