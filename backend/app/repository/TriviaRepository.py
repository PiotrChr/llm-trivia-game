import sqlite3
import json
from werkzeug.security import check_password_hash, generate_password_hash

from utils.Database import Database

class TriviaRepository:
    def __init__(self):
        pass


    @staticmethod    
    def row_to_dict(row):
        if row:
            return dict(zip(row.keys(), row))
        else:
            return None


    @staticmethod
    def check_hash(hashed_password: str, password: str) -> bool:
        return check_password_hash(hashed_password, password)


    @staticmethod
    def draw_question(game_id, category, difficulty):
        query = """
            SELECT questions.*, answers.id as answer_id, answers.text as answer_text, answers.is_correct as answer_is_correct
            FROM questions
            JOIN answers ON questions.id = answers.question_id
            WHERE questions.category = ? AND questions.difficulty = ? AND questions.id NOT IN (
                SELECT questions.id
                FROM questions
                JOIN answers ON questions.id = answers.question_id
                JOIN player_answers ON answers.id = player_answers.answer_id
                WHERE player_answers.game_id = ?
            )
            GROUP BY questions.id
            ORDER BY RANDOM()
            LIMIT 1
        """
        params = (category, difficulty, game_id)
        try:
            Database.get_cursor().execute(query, params)
            return Database.get_cursor().fetchone()
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None

    @staticmethod
    def get_questions_texts(category, difficulty, limit=None):
        query = """
            SELECT questions.text
            FROM questions
            WHERE questions.category = ? AND questions.difficulty = ?
            ORDER BY RANDOM()
        """
        params = (category, difficulty)
        if limit:
            query += " LIMIT ?"
            params += (limit,)
        try:
            Database.get_cursor().execute(query, params)
            return Database.get_cursor().fetchall()
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None


    @staticmethod
    def set_current_category(game_id, category):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            game_sql = """
                UPDATE games SET current_category = ? WHERE id = ?
            """
            Database.execute(game_sql, (category, game_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def add_questions(questions, category_id, difficulty):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            for question in questions:
                question_sql = """
                    INSERT INTO questions (text, category, difficulty)
                    VALUES (?, ?, ?)
                """
                question_id = Database.insert(question_sql, (question["question"], category_id, difficulty), False)

                for answer in question["answers"]:
                    answer_sql = """
                        INSERT INTO answers (text, is_correct, question_id)
                        VALUES (?, ?, ?)
                    """
                    Database.insert(answer_sql, (answer, answer == question["correct_answer"], question_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def create_category(category_name):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            category_sql = """
                INSERT INTO categories (name)
                VALUES (?)
            """
            cat_id = Database.insert(category_sql, (category_name,), False)

            Database.execute("COMMIT")
            return cat_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def get_categories():
        query = """
            SELECT * FROM categories
        """
        try:
            Database.get_cursor().execute(query)
            categories = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(category) for category in categories]
        except sqlite3.Error as error:
            print(f"Failed to read data from table categories: {error}")
            return None

    @staticmethod
    def get_category_by_name(category):
        query = """
            SELECT * FROM categories WHERE name = ?
        """
        params = (category,)
        try:
            Database.get_cursor().execute(query, params)
            category = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(category)
        except sqlite3.Error as error:
            print(f"Failed to read data from table categories: {error}")
            return None

    @staticmethod
    def get_player_by_name(username):
        query = """
            SELECT * FROM players WHERE name = ?
        """
        params = (username,)
        try:
            Database.get_cursor().execute(query, params)
            player = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(player)
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None


    @staticmethod
    def get_player_by_id(player_id):
        query = """
            SELECT * FROM players WHERE id = ?
        """
        params = (player_id,)
        try:
            Database.get_cursor().execute(query, params)
            player = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(player)
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None
        
    @staticmethod
    def answer_question(game_id, player_id, answer_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_answer_sql = """
                INSERT INTO player_answers (player_id, game_id, answer_id)
                VALUES (?, ?, ?)
            """
            Database.insert(player_answer_sql, (player_id, game_id, answer_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def create_game(
        password,
        max_questions,
        host,
        current_category,
        time_limit
    ):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            print(f"Creating game with password: {password}, max_questions: {max_questions}, host: {host}, current_category: {current_category}, time_limit: {time_limit}")

            game_sql = """
                INSERT INTO games (password, max_questions, host, current_category, time_limit)
                VALUES (?, ?, ?, ?, ?)
            """
            game_id = Database.insert(game_sql, (password, max_questions, host, current_category, time_limit), False)

            print(f"Game ID: {game_id}")

            player_game_sql = """
                INSERT INTO player_games (player_id, game_id)
                VALUES (?, ?)
            """
            Database.insert(player_game_sql, (host, game_id), False)

            Database.execute("COMMIT")

            return game_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None
   

    @staticmethod
    def get_games():
        query = """
            SELECT games.*, 
            json_group_array(
                json_object('player_id', players.id, 'name', players.name)
            ) as players
            FROM games
            LEFT JOIN player_games ON games.id = player_games.game_id
            LEFT JOIN players ON player_games.player_id = players.id
            GROUP BY games.id
        """
        try:
            Database.get_cursor().execute(query)
            games = Database.get_cursor().fetchall()
            parsed_games = []
            for game in games:
                game_dict = TriviaRepository.row_to_dict(game)
                game_dict["players"] = json.loads(game_dict["players"])
                parsed_games.append(game_dict)
            return parsed_games
        except sqlite3.Error as error:
            print(f"Failed to read data from table games: {error}")
            return None


    @staticmethod
    def get_game_by_id(game_id):
        query = """
            SELECT * FROM games WHERE id = ?
        """
        params = (game_id,)
        try:
            Database.get_cursor().execute(query, params)
            game = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(game)
        except sqlite3.Error as error:
            print(f"Failed to read data from table games: {error}")
            return None
        
    @staticmethod
    def is_playing(game_id, player_id):
        query = """
            SELECT * FROM player_games WHERE game_id = ? AND player_id = ?
        """
        params = (game_id, player_id)
        try:
            Database.get_cursor().execute(query, params)
            player_game = Database.get_cursor().fetchone()
            return player_game is not None
        except sqlite3.Error as error:
            print(f"Failed to read data from table player_games: {error}")
            return None

    @staticmethod
    def start_game(game_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            game_sql = """
                UPDATE games SET time_start = datetime('now') WHERE id = ?
            """
            Database.execute(game_sql, (game_id,), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False   

    @staticmethod
    def player_join(player_id, game_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_game_sql = """
                INSERT INTO player_games (player_id, game_id)
                VALUES (?, ?)
            """
            Database.insert(player_game_sql, (player_id, game_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False


    @staticmethod        
    def create_player(player_name, player_email, player_password):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_sql = """
                INSERT INTO players (name, email, password)
                VALUES (?, ?, ?)
            """
            
            player_id = Database.insert(player_sql, (player_name, player_email, player_password), False)

            Database.execute("COMMIT")

            return player_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None
        
    @staticmethod
    def end_game(self, game_id, player_id):
        try:
            cursor = Database.get_cursor()

            cursor.execute("BEGIN TRANSACTION", commit=False)

            # Calculate total score for this game by the player
            cursor.execute(
                """
                SELECT SUM(answers.is_correct) as score 
                FROM player_answers 
                JOIN answers ON player_answers.answer_id = answers.id
                WHERE player_answers.game_id = ? AND player_answers.player_id = ?
                """,
                (game_id, player_id),
                False
            )

            score = cursor.fetchone()[0] or 0

            # End the game by setting the end time
            cursor.execute(
                "UPDATE games SET time_end = datetime('now') WHERE id = ?",
                (game_id,),
                False
            )
            
            # Update the player's total score
            cursor.execute(
                "UPDATE players SET total_score = total_score + ? WHERE id = ?",
                (score, player_id),
                False
            )

            Database.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False
        
    @staticmethod
    def get_game_stats(self, game_id):
        try:
            cursor = Database.get_cursor()

            cursor.execute("BEGIN TRANSACTION", commit=False)

            # Fetch game details
            cursor.execute(
                "SELECT * FROM games WHERE id = ?",
                (game_id,)
            )
            game = cursor.fetchone()

            if not game:
                return None

            # Fetch players of the game and their total score in the game
            cursor.execute(
                """
                SELECT players.name, SUM(answers.is_correct) as score 
                FROM player_answers
                JOIN players ON player_answers.player_id = players.id
                JOIN answers ON player_answers.answer_id = answers.id
                WHERE player_answers.game_id = ?
                GROUP BY players.name
                """,
                (game_id,)
            )
            player_scores = cursor.fetchall()
            player_scores = [dict(row) for row in player_scores]

            # Fetch number of correct and incorrect answers per player in the game
            cursor.execute(
                """
                SELECT players.name, answers.is_correct, COUNT(answers.is_correct) as count 
                FROM player_answers
                JOIN players ON player_answers.player_id = players.id
                JOIN answers ON player_answers.answer_id = answers.id
                WHERE player_answers.game_id = ?
                GROUP BY players.name, answers.is_correct
                """,
                (game_id,)
            )
            answer_counts = cursor.fetchall()
            answer_counts = [dict(row) for row in answer_counts]

            # Convert the results into a more usable format
            game_stats = {
                "game_id": game_id,
                "time_start": game["time_start"],
                "time_end": game["time_end"],
                "players": {},
            }

            for player in player_scores:
                game_stats["players"][player["name"]] = {
                    "total_score": player["score"],
                    "correct_answers": 0,
                    "incorrect_answers": 0,
                }

            for player in answer_counts:
                if player["is_correct"]:
                    game_stats["players"][player["name"]]["correct_answers"] = player["count"]
                else:
                    game_stats["players"][player["name"]]["incorrect_answers"] = player["count"]

            return game_stats
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None
        
    
    @staticmethod
    def get_players():
        query = """
            SELECT * FROM players
        """
        try:
            Database.get_cursor().execute(query)
            players = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(player) for player in players]
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None
        

    @staticmethod
    def get_languages():
        query = """
            SELECT * FROM language
        """
        try:
            Database.get_cursor().execute(query)
            languages = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(language) for language in languages]
        except sqlite3.Error as error:
            print(f"Failed to read data from table languages: {error}")
            return None

    @staticmethod
    def generate_hash(password: str) -> str:
        return generate_password_hash(password)