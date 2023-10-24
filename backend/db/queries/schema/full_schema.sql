PRAGMA foreign_keys = ON;

CREATE TABLE answers (
    id INTEGER PRIMARY KEY,
    question_id INTEGER NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE TABLE language (
    id INTEGER PRIMARY KEY,
    iso_code TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    time_start DATETIME DEFAULT NULL,
    time_end DATETIME DEFAULT NULL,
    is_timed BOOLEAN DEFAULT FALSE,
    auto_start BOOLEAN DEFAULT FALSE,
    time_limit INTEGER DEFAULT 0,
    eliminate_on_fail BOOLEAN DEFAULT FALSE,
    host INTEGER NOT NULL,
    current_category INTEGER DEFAULT NULL,
    all_categories BOOLEAN DEFAULT FALSE,
    current_language INT DEFAULT NULL,
    max_questions INTEGER DEFAULT 0,
    mode_id INTEGER NOT NULL,
    public BOOLEAN DEFAULT FALSE,
    password TEXT DEFAULT NULL,
    FOREIGN KEY (host) REFERENCES users(id),
    FOREIGN KEY (current_category) REFERENCES category(id)
    FOREIGN KEY (mode_id) REFERENCES game_modes(id)
);

CREATE TABLE game_players (
    game_id INTEGER,
    player_id INTEGER,
    PRIMARY KEY(game_id, player_id),
    FOREIGN KEY(game_id) REFERENCES games(id),
    FOREIGN KEY(player_id) REFERENCES players(id)
);

CREATE TABLE players (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    google_id TEXT DEFAULT NULL, -- for future Google Authentication
    total_score INTEGER DEFAULT 0,
    password TEXT NOT NULL
);

CREATE TABLE category (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question_text TEXT NOT NULL,
    category INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    FOREIGN KEY (category) REFERENCES category(id)
);

CREATE TABLE game_questions (
    question_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(game_id, question_id),
    FOREIGN KEY(game_id) REFERENCES games(id)
    FOREIGN KEY(question_id) REFERENCES questions(id)
)

CREATE TABLE player_games (
    player_id INTEGER,
    game_id INTEGER,
    time_spent INTEGER DEFAULT 0,
    PRIMARY KEY(player_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
)

CREATE TABLE player_answers (
    player_id INTEGER,
    question_id INTEGER,
    answer_id INTEGER,
    game_id INTEGER,
    miss BOOLEAN DEFAULT 0,
    PRIMARY KEY(player_id, question_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    FOREIGN KEY(answer_id) REFERENCES answers(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
);

CREATE TABLE question_translations (
    question_id INTEGER,
    language_id INTEGER,
    question_text TEXT NOT NULL,
    PRIMARY KEY(question_id, language_id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);

CREATE TABLE answer_translations (
    answer_id INTEGER,
    language_id INTEGER,
    answer_text TEXT NOT NULL,
    PRIMARY KEY(answer_id, language_id),
    FOREIGN KEY(answer_id) REFERENCES answers(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);

CREATE TABLE category_translations (
    category_id INTEGER,
    language_id INTEGER,
    category_name TEXT NOT NULL,
    PRIMARY KEY(category_id, language_id),
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(language_id) REFERENCES language(id)
);

CREATE TABLE report_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE report {
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    report_type INTEGER NOT NULL,
    report TEXT DEFAULT NULL,
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(question_id) REFERENCES questions(id)
    FOREIGN KEY(report_type) REFERENCES report_types(id)
}

CREATE TABLE lifeline_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE game_lifelines (
    game_id INTEGER,
    lifeline_id INTEGER,
    count INTEGER NOT NULL,
    PRIMARY KEY(game_id, lifeline_id),
    FOREIGN KEY(game_id) REFERENCES games(id),
    FOREIGN KEY(lifeline_id) REFERENCES lifeline_types(id)
);

CREATE TABLE player_lifelines (
    player_id INTEGER,
    lifeline_id INTEGER,
    game_id INTEGER,
    question_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(player_id, lifeline_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(lifeline_id) REFERENCES lifeline_types(id)
    FOREIGN KEY(game_id) REFERENCES games(id)
    FOREIGN KEY(question_id) REFERENCES questions(id)
);

CREATE TABLE friends (
    player_id INTEGER,
    friend_id INTEGER,
    PRIMARY KEY(player_id, friend_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(friend_id) REFERENCES players(id)
);

CREATE TABLE friend_invitations (
    player_id INTEGER,
    friend_id INTEGER,
    PRIMARY KEY(player_id, friend_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(friend_id) REFERENCES players(id)
);

CREATE TABLE game_invitations (
    player_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY(player_id, game_id),
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
);

CREATE TABLE notification_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

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

CREATE TABLE rank_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE tiers (
    id INTEGER PRIMARY KEY,
    rank_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL,
    max_points INTEGER NOT NULL,
    FOREIGN KEY(rank_type_id) REFERENCES rank_types(id)
);

CREATE TABLE badges (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE player_badges (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(player_id) REFERENCES players(id),
    FOREIGN KEY(badge_id) REFERENCES badges(id)
);

CREATE TABLE game_modes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE game_rankings (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    mode_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    questions_answered INTEGER DEFAULT 0,
    rank INTEGER NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (mode_id) REFERENCES game_modes(id)
);

CREATE TABLE question_submission (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    answers TEXT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE category_submission (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    name TEXT NOT NULL,
);
