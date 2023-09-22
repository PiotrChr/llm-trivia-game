import sqlite3
import os

def run_sql_script(filename):
    print(f"Running script {filename}...")
    with sqlite3.connect('backend/db/db.sqlite') as conn:
        if os.path.isfile(filename):
            with open(filename, 'r') as f:
                sql = f.read()
                conn.executescript(sql)
        else:
            print(f"Script file {filename} does not exist")

def create_tables():
    run_sql_script('backend/db/queries/fixtures/language.sql')
    run_sql_script('backend/db/queries/fixtures/category.sql')
    run_sql_script('backend/db/queries/fixtures/players.sql')
    run_sql_script('backend/db/queries/fixtures/report_types.sql')
    run_sql_script('backend/db/queries/fixtures/questions.sql')
    run_sql_script('backend/db/queries/fixtures/answers.sql')
    run_sql_script('backend/db/queries/fixtures/lifeline_types.sql')
    run_sql_script('backend/db/queries/fixtures/notification_types.sql')

if __name__ == "__main__":
    create_tables()