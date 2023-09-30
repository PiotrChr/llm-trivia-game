import sqlite3

def remove_tables():
    conn = sqlite3.connect('backend/db/db.sqlite')

    c = conn.cursor()

    c.execute('DROP TABLE IF EXISTS player_answers')
    c.execute('DROP TABLE IF EXISTS answers')
    c.execute('DROP TABLE IF EXISTS questions')
    c.execute('DROP TABLE IF EXISTS language')
    c.execute('DROP TABLE IF EXISTS category')
    c.execute('DROP TABLE IF EXISTS players')
    c.execute('DROP TABLE IF EXISTS player_games')
    c.execute('DROP TABLE IF EXISTS game_questions')
    c.execute('DROP TABLE IF EXISTS games')
    c.execute('DROP TABLE IF EXISTS question_translations')
    c.execute('DROP TABLE IF EXISTS answer_translations')
    c.execute('DROP TABLE IF EXISTS report')
    c.execute('DROP TABLE IF EXISTS report_types')
    c.execute('DROP TABLE IF EXISTS lifeline_types')
    c.execute('DROP TABLE IF EXISTS lifelines')
    c.execute('DROP TABLE IF EXISTS friends')
    c.execute('DROP TABLE IF EXISTS friend_invitations')
    c.execute('DROP TABLE IF EXISTS game_invitations')
    c.execute('DROP TABLE IF EXISTS notifications')
    c.execute('DROP TABLE IF EXISTS notification_types')
    c.execute('DROP TABLE IF EXISTS game_modes')
    c.execute('DROP TABLE IF EXISTS game_rankings')

    conn.commit()

    conn.close()

if __name__ == "__main__":
    remove_tables()
    