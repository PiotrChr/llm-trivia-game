import sqlite3
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
            SELECT * FROM games
        """
        try:
            Database.get_cursor().execute(query)
            games = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(game) for game in games]
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
    def generate_hash(password: str) -> str:
        return generate_password_hash(password)