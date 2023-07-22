import sqlite3
import os

def run_sql_script(filename):
    with sqlite3.connect('db.sqlite') as conn:
        if os.path.isfile(filename):
            with open(filename, 'r') as f:
                sql = f.read()
                conn.executescript(sql)
        else:
            print(f"Script file {filename} does not exist")

def create_tables():
    run_sql_script('db/queries/schema/players.sql')
    run_sql_script('db/queries/schema/questions.sql')
    run_sql_script('db/queries/schema/answers.sql')
    run_sql_script('db/queries/schema/game_questions.sql')
    run_sql_script('db/queries/schema/player_answers.sql')
    run_sql_script('db/queries/schema/player_games.sql')
    run_sql_script('db/queries/schema/games.sql')

if __name__ == "__main__":
    create_tables()