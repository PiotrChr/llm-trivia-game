import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash

from backend.utils.Database import Database

class TriviaRepository:
    def __init__(self):
        pass

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
            return player
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None

    @staticmethod
    def create_game(player_ids, is_timed=False, time_limit=None):
        try:
            Database.execute("BEGIN TRANSACTION")

            game_sql = """
                INSERT INTO games (is_timed, time_limit)
                VALUES (?, ?)
            """
            game_id = Database.insert(game_sql, (is_timed, time_limit))

            player_game_sql = """
                INSERT INTO player_games (player_id, game_id)
                VALUES (?, ?)
            """
            for player_id in player_ids:
                Database.insert(player_game_sql, (player_id, game_id))

            Database.execute("COMMIT")

            return game_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None

    @staticmethod        
    def create_player(player_name, player_password):
        try:
            Database.execute("BEGIN TRANSACTION")

            player_sql = """
                INSERT INTO players (name, password)
                VALUES (?, ?)
            """
            
            player_id = Database.insert(player_sql, (player_name, player_password))

            Database.execute("COMMIT")

            return player_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None
    
    def end_game(self, game_id, player_id):
        cursor = Database.get_cursor()

        # Calculate total score for this game by the player
        cursor.execute(
            """
            SELECT SUM(answers.is_correct) as score 
            FROM player_answers 
            JOIN answers ON player_answers.answer_id = answers.id
            WHERE player_answers.game_id = ? AND player_answers.player_id = ?
            """,
            (game_id, player_id)
        )

        score = cursor.fetchone()[0] or 0

        # End the game by setting the end time
        cursor.execute(
            "UPDATE games SET time_end = datetime('now') WHERE id = ?",
            (game_id,)
        )
        
        # Update the player's total score
        cursor.execute(
            "UPDATE players SET total_score = total_score + ? WHERE id = ?",
            (score, player_id)
        )

        Database.commit()

        return cursor.rowcount > 0
    
    def get_game_stats(self, game_id):
        cursor = Database.get_cursor()

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
    
    @staticmethod
    def generate_hash(password: str) -> str:
        return generate_password_hash(password)