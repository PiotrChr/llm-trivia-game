import sqlite3

def clear_tables():
    conn = sqlite3.connect('backend/db/db.sqlite')

    c = conn.cursor()

    c.execute('DELETE FROM player_answers; ALTER TABLE player_answers AUTOINCREMENT = 1')
    c.execute('DELETE FROM answers; ALTER TABLE answers AUTOINCREMENT = 1')
    c.execute('DELETE FROM questions; ALTER TABLE questions AUTOINCREMENT = 1')
    c.execute('DELETE FROM players; ALTER TABLE players AUTOINCREMENT = 1')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    clear_tables()