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
    run_sql_script('backend/db/queries/schema/language.sql')
    run_sql_script('backend/db/queries/schema/players.sql')
    run_sql_script('backend/db/queries/schema/category.sql')
    run_sql_script('backend/db/queries/schema/questions.sql')
    run_sql_script('backend/db/queries/schema/answers.sql')
    run_sql_script('backend/db/queries/schema/game_questions.sql')
    run_sql_script('backend/db/queries/schema/player_answers.sql')
    run_sql_script('backend/db/queries/schema/games.sql')
    run_sql_script('backend/db/queries/schema/player_games.sql')
    run_sql_script('backend/db/queries/schema/question_translations.sql')
    run_sql_script('backend/db/queries/schema/answer_translations.sql')
    run_sql_script('backend/db/queries/schema/report.sql')
    run_sql_script('backend/db/queries/schema/report_types.sql')

if __name__ == "__main__":
    create_tables()