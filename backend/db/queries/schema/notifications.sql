PRAGMA foreign_keys = ON;

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    notification_type INTEGER NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(notification_type) REFERENCES notification_types(id)
);