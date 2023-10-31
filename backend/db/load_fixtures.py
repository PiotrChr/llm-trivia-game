import sqlite3
import os

def run_sql_script(filename):
    print(f"Running script {filename}...")
    with sqlite3.connect('backend/db/db.sqlite') as conn:
        if os.path.isfile(filename):
            with open(filename, 'r') as f:
                sql = f.read()
                try:
                    conn.executescript(sql)
                except sqlite3.Error as e:
                    print(f"An error occurred: {e.args[0]}")
        else:
            print(f"Script file {filename} does not exist")

def create_tables():
    run_sql_script('backend/db/queries/fixtures/language.sql')
    run_sql_script('backend/db/queries/fixtures/category.sql')
    run_sql_script('backend/db/queries/fixtures/players.sql')
    run_sql_script('backend/db/queries/fixtures/report_types.sql')
    run_sql_script('backend/db/queries/fixtures/questions.sql')
    # run_sql_script('backend/db/queries/fixtures/questions2.sql')
    run_sql_script('backend/db/queries/fixtures/answers.sql')
    # run_sql_script('backend/db/queries/fixtures/answers2.sql')
    run_sql_script('backend/db/queries/fixtures/lifeline_types.sql')
    run_sql_script('backend/db/queries/fixtures/notification_types.sql')
    run_sql_script('backend/db/queries/fixtures/game_modes.sql')
    run_sql_script('backend/db/queries/fixtures/rank_types.sql')

if __name__ == "__main__":
    create_tables()