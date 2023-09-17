PRAGMA foreign_keys = ON;

CREATE TABLE friends (
    player_id INTEGER,
    friend_id INTEGER,
    PRIMARY KEY(player_id, friend_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(friend_id) REFERENCES players(id)
);