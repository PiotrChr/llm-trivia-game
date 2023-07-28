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

    conn.commit()

    conn.close()

if __name__ == "__main__":
    remove_tables()