import sqlite3

def clear_tables():
    conn = sqlite3.connect('db.sqlite')

    c = conn.cursor()

    c.execute('DROP TABLE IF EXISTS player_answers')
    c.execute('DROP TABLE IF EXISTS answers')
    c.execute('DROP TABLE IF EXISTS questions')
    c.execute('DROP TABLE IF EXISTS players')
    c.execute('DROP TABLE IF EXISTS players')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    clear_tables()