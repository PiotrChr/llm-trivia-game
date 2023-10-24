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
    def draw_question(game_id, category, difficulty, language='en', limit=1):
        query = """
            WITH 
            QuestionLanguage AS (
                SELECT questions.id AS qid, 
                    CASE WHEN ? = 'en' THEN questions.question_text ELSE qt.question_text END AS question_text,
                    questions.category,
                    questions.difficulty
                FROM questions
                LEFT JOIN question_translations qt ON questions.id = qt.question_id AND qt.language_id = (SELECT id FROM language WHERE iso_code = ?)
            ),
            AnswerLanguage AS (
                SELECT answers.id AS aid, answers.question_id,
                    CASE WHEN ? = 'en' THEN answers.answer_text ELSE at.answer_text END AS answer_text,
                    answers.is_correct
                FROM answers
                LEFT JOIN answer_translations at ON answers.id = at.answer_id AND at.language_id = (SELECT id FROM language WHERE iso_code = ?)
            )

            SELECT ql.question_text, ql.qid as id, ql.category, ql.difficulty,
                json_group_array(
                    json_object('id', al.aid, 'text', al.answer_text, 'is_correct', al.is_correct)
                ) as answers
            FROM QuestionLanguage ql
            JOIN AnswerLanguage al ON ql.qid = al.question_id
            WHERE ql.qid NOT IN (
                SELECT questions.id
                FROM questions
                JOIN answers ON questions.id = answers.question_id
                JOIN player_answers ON answers.id = player_answers.answer_id
                WHERE player_answers.game_id = ?
            ) AND ql.category = ? AND ql.difficulty = ?
            GROUP BY ql.qid
            ORDER BY RANDOM()
            LIMIT ?
        """
        params = (language,language, language, language, game_id, category, difficulty, limit)
        try:
            Database.get_cursor().execute(query, params)
            question = Database.get_cursor().fetchone()
            
            if question is None:
                return None
            
            questionDict = TriviaRepository.row_to_dict(question)
            questionDict["answers"] = json.loads(questionDict['answers'])

            return questionDict
            
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None

    def get_untraslated_questions(target_language, category=None, limit=100):
        pass
        # TODO

    @staticmethod
    def get_questions():
        query = """
            SELECT questions.*,
            json_group_array(
                json_object('id', answers.id, 'text', answers.answer_text, 'is_correct', answers.is_correct)
            ) as answers
            FROM questions
            JOIN answers ON questions.id = answers.question_id
            GROUP BY questions.id
        """
        try:
            Database.get_cursor().execute(query)
            questions = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(question) for question in questions]
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None

        
    @staticmethod
    def get_question_by_id(game_id):
        query = """
            SELECT questions.*, answers.id as answer_id, answers.answer_text as answer_text, answers.is_correct as answer_is_correct
            FROM questions
            JOIN answers ON questions.id = answers.question_id
            WHERE questions.id IN (
                SELECT questions.id
                FROM questions
                JOIN answers ON questions.id = answers.question_id
                JOIN player_answers ON answers.id = player_answers.answer_id
                WHERE player_answers.game_id = ?
            )
            GROUP BY questions.id
            ORDER BY RANDOM()
        """
        params = (game_id,)
        try:
            Database.get_cursor().execute(query, params)
            return Database.get_cursor().fetchall()
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None

    @staticmethod
    def get_questions_texts(category, difficulty, limit=50):
        print(f"Getting questions for category {category} and difficulty {difficulty}")
        query = """
            SELECT questions.question_text
            FROM questions
            WHERE questions.category = ? AND questions.difficulty = ?
            ORDER BY RANDOM()
        """
        params = (category, difficulty)
        if limit is not None:
            query += " LIMIT ?"
            params += (limit,)
        try:
            Database.get_cursor().execute(query, params)
            texts = Database.get_cursor().fetchall()
            return [text["question_text"] for text in texts]
        except sqlite3.Error as error:
            print(f"Failed to read data from table questions: {error}")
            return None

    @staticmethod
    def get_random_category():
        query = """
            SELECT id FROM category ORDER BY RANDOM() LIMIT 1
        """
        try:
            Database.get_cursor().execute(query)
            category = Database.get_cursor().fetchone()
            return category["id"]
        except sqlite3.Error as error:
            print(f"Failed to read data from table category: {error}")
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
                    INSERT INTO questions (question_text, category, difficulty)
                    VALUES (?, ?, ?)
                """
                question["id"] = Database.insert(question_sql, (question["question"], category_id, difficulty), False)
                
                for answer in question["answers"]:
                    answer_sql = """
                        INSERT INTO answers (answer_text, is_correct, question_id)
                        VALUES (?, ?, ?)
                    """
                    answer["id"] = Database.insert(answer_sql, (answer["text"], answer['is_correct'], question["id"]), False)
                    
            Database.execute("COMMIT")
            
            return questions
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def create_category(category_name):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            category_sql = """
                INSERT INTO category (name)
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
            SELECT * FROM category
        """
        try:
            Database.get_cursor().execute(query)
            categories = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(category) for category in categories]
        except sqlite3.Error as error:
            print(f"Failed to read data from table category: {error}")
            return None

    @staticmethod
    def get_category_by_name(category):
        query = """
            SELECT * FROM category WHERE name = ?
        """
        params = (category,)
        try:
            Database.get_cursor().execute(query, params)
            category = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(category)
        except sqlite3.Error as error:
            print(f"Failed to read data from table category: {error}")
            return None
        
    @staticmethod
    def get_category_by_id(category_id):
        query = """
            SELECT * FROM category WHERE id = ?
        """
        params = (category_id,)
        try:
            Database.get_cursor().execute(query, params)
            category = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(category)
        except sqlite3.Error as error:
            print(f"Failed to read data from table category: {error}")
            return None

    @staticmethod
    def get_player_points_by_game(game_id, player_id):
        query = """
            SELECT SUM(answers.is_correct) as points
            FROM answers
            JOIN player_answers ON answers.id = player_answers.answer_id
            WHERE player_answers.game_id = ? AND player_answers.player_id = ?
        """
        params = (game_id, player_id)
        try:
            Database.get_cursor().execute(query, params)
            points = Database.get_cursor().fetchone()
            return points["points"]
        except sqlite3.Error as error:
            print(f"Failed to read data from table answers: {error}")
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
    def get_player_answers(game_id, player_id):
        print(f"Getting player answers for player {player_id} in game {game_id}")

        query = """
            SELECT player_answers.answer_id, category.id, category.id as category_id, category.name as category_name, answers.is_correct as is_correct
            FROM player_answers
            JOIN questions ON player_answers.question_id = questions.id
            JOIN category ON questions.category = category.id
            JOIN answers ON player_answers.answer_id = answers.id
            WHERE player_answers.player_id = ?
        """

        if game_id:
            query += " AND player_answers.game_id = ?"
            params = (player_id, game_id)
        else:
            params = (player_id,)
        try:
            Database.get_cursor().execute(query, params)
            answers = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(answer) for answer in answers]
        except sqlite3.Error as error:
            print(f"Failed to read data from table player_answers: {error}")
            return None

    @staticmethod
    def answer_question(game_id, question_id, player_id, answer_id):
        try:
            game = TriviaRepository.get_game_by_id(game_id)
            is_correct = Database.get_cursor().execute(
                "SELECT is_correct FROM answers WHERE id = ?",
                (answer_id,)
            ).fetchone()["is_correct"]

            player_answer_sql = """
                INSERT INTO player_answers (player_id, question_id, game_id, answer_id)
                VALUES (?, ?, ?, ?)
            """
            Database.insert(player_answer_sql, (player_id, question_id, game_id, answer_id), True)

            TriviaRepository.increment_question_by_game_mode(player_id, game['mode']['id'])

            if is_correct:
                TriviaRepository.increment_score_for_game_mode(player_id, game['mode']['id'])

            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def increment_score_for_game_mode(player_id, mode_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            ranking_sql = """
                UPDATE game_rankings SET score = score + 1 WHERE player_id = ? AND mode_id = ?
            """
            Database.execute(ranking_sql, (player_id, mode_id), False)

            Database.execute("COMMIT")
            return True
        except:
            Database.execute("ROLLBACK")
            return False


    @staticmethod
    def increment_question_by_game_mode(player_id, mode_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            ranking_sql = """
                UPDATE game_rankings SET questions_answered = questions_answered + 1 WHERE player_id = ? AND mode_id = ?
            """
            Database.execute(ranking_sql, (player_id, mode_id), False)

            Database.execute("COMMIT")
            return True
        except:
            Database.execute("ROLLBACK")
            return False


    @staticmethod
    def get_player_ranking_by_mode(player_id, mode_id):
        query = """
            SELECT ranking.*, game_modes.name as mode_name
            FROM game_rankings
            JOIN game_modes ON ranking.mode_id = game_modes.id
            WHERE ranking.player_id = ? AND ranking.mode_id = ?
        """
        params = (player_id, mode_id)
        try:
            Database.get_cursor().execute(query, params)
            ranking = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(ranking)
        except sqlite3.Error as error:
            print(f"Failed to read data from table ranking: {error}")
            return None

    @staticmethod
    def create_ranking_for_mode(player_id, mode_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            ranking_sql = """
                INSERT INTO ranking (player_id, mode_id)
                VALUES (?, ?)
            """
            Database.insert(ranking_sql, (player_id, mode_id), False)

            Database.execute("COMMIT")
            return True
        except:
            Database.execute("ROLLBACK")
            return False

    @staticmethod
    def miss_answer(game_id, question_id, player_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            query = """
                INSERT INTO player_answers (player_id, question_id, game_id, miss)
                VALUES (?, ?, ?, ?)
            """

            Database.insert(query, (player_id, question_id, game_id, True), False)

            Database.execute("COMMIT")
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def set_game_language(game_id, language_iso_code):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            language_sql = """
                UPDATE games SET current_language = (SELECT id FROM language WHERE iso_code = ?) WHERE id = ?
            """
            Database.execute(language_sql, (language_iso_code, game_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False
        

    @staticmethod
    def create_game(
        game_mode,
        password,
        max_questions,
        host,
        current_category,
        all_categories,
        time_limit,
        language='en',
        auto_start=False,
        eliminate_on_fail=False,
        selected_lifelines=None,
        is_public=False
    ):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            print(f"Creating game with password: {password}, max_questions: {max_questions}, host: {host}, current_category: {current_category}, time_limit: {time_limit}, language: {language}, auto_start: {auto_start}")

            language_id = Database.get_cursor().execute(
                "SELECT id FROM language WHERE iso_code = ?",
                (language,)
            ).fetchone()["id"]
            
            game_sql = """
                INSERT INTO games (password, max_questions, host, current_category, time_limit, current_language, auto_start, mode_id, eliminate_on_fail, all_categories, is_public)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            game_id = Database.insert(game_sql, (password, max_questions, host, current_category, time_limit, language_id, auto_start, game_mode, eliminate_on_fail, all_categories, is_public), False)

            print(f"Game ID: {game_id}")

            player_game_sql = """
                INSERT INTO player_games (player_id, game_id)
                VALUES (?, ?)
            """
            Database.insert(player_game_sql, (host, game_id), False)

            if selected_lifelines:
                for lifeline in selected_lifelines:
                    lifeline_id = Database.get_cursor().execute(
                        "SELECT id FROM lifeline_types WHERE name = ?",
                        (lifeline['name'],)
                    ).fetchone()["id"]

                    lifeline_sql = """
                        INSERT INTO game_lifelines (game_id, lifeline_id, count)
                        VALUES (?, ?, ?)
                    """
                    Database.insert(lifeline_sql, (game_id, lifeline_id, lifeline['count']), False)
                    
            Database.execute("COMMIT")

            return game_id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return None
   
    @staticmethod
    def add_points(player_id, mode_id, points):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_game_sql = """
                UPDATE game_rankings SET score = score + ? WHERE player_id = ? AND mode_id = ?
            """
            Database.execute(player_game_sql, (points, player_id, mode_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def get_answer_by_id(answer_id):
        query = """
            SELECT * FROM answers WHERE id = ?
        """
        params = (answer_id,)
        try:
            Database.get_cursor().execute(query, params)
            answer = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(answer)
        except sqlite3.Error as error:
            print(f"Failed to read data from table answers: {error}")
            return None

    @staticmethod
    def get_games(isPublic=False):
        query = """
            SELECT games.*, 
            json_group_array(
                json_object('player_id', players.id, 'name', players.name)
            ) as players,
            json_object('id', category.id, 'name', category.name) as current_category,
            json_object('id', game_modes.id, 'name', game_modes.name) as mode
            FROM games
            LEFT JOIN player_games ON games.id = player_games.game_id
            LEFT JOIN players ON player_games.player_id = players.id
            LEFT JOIN category ON games.current_category = category.id
            LEFT JOIN game_modes ON games.mode_id = game_modes.id
            WHERE games.is_public = ?
            GROUP BY games.id
        """
        try:
            Database.get_cursor().execute(query)
            games = Database.get_cursor().fetchall()
            parsed_games = []
            for game in games:
                game_dict = TriviaRepository.row_to_dict(game)
                game_dict["players"] = json.loads(game_dict["players"])
                game_dict["current_category"] = json.loads(game_dict["current_category"])
                game_dict["mode"] = json.loads(game_dict["mode"])
                parsed_games.append(game_dict)
            return parsed_games
        except sqlite3.Error as error:
            print(f"Failed to read data from table games: {error}")
            return None

    @staticmethod
    def get_game_modes():
        query = """
            SELECT * FROM game_modes
        """
        try:
            Database.get_cursor().execute(query)
            modes = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(mode) for mode in modes]
        except sqlite3.Error as error:
            print(f"Failed to read data from table game_modes: {error}")
            return None

    @staticmethod
    def get_game_by_id(game_id):
        query = """
            SELECT
                games.*,
                (
                    SELECT count(DISTINCT player_answers.question_id)
                    FROM player_answers
                    WHERE games.id = player_answers.game_id
                ) as questions_answered,
                json_group_array(json_object('player_id', players.id, 'name', players.name)) as players,
                json_object('id', language.id, 'name', language.name, 'iso_code', language.iso_code) as language,
                json_object('id', category.id, 'name', category.name) as current_category,
                json_object('id', game_modes.id, 'name', game_modes.name) as mode
            FROM games
            LEFT JOIN player_games ON games.id = player_games.game_id
            LEFT JOIN players ON player_games.player_id = players.id
            LEFT JOIN category ON games.current_category = category.id
            LEFT JOIN language ON games.current_language = language.id
            LEFT JOIN game_modes ON games.mode_id = game_modes.id
            LEFT JOIN player_answers ON games.id = player_answers.game_id
            WHERE games.id = ?
        """
        params = (game_id,)

        try:
            Database.get_cursor().execute(query, params)
            game = Database.get_cursor().fetchone()
            
            if game and game["id"]:
                game_dict = TriviaRepository.row_to_dict(game)
                game_dict["players"] = json.loads(game_dict["players"])
                game_dict["current_category"] = json.loads(game_dict["current_category"])
                game_dict["language"] = json.loads(game_dict["language"])
                game_dict["mode"] = json.loads(game_dict["mode"])
                return game_dict
            else:
                return None
            
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
            
            game = TriviaRepository.get_game_by_id(game_id)
            ranking = TriviaRepository.get_player_ranking_by_mode(player_id, game["mode"]["id"])

            if ranking is None:
                TriviaRepository.create_ranking_for_mode(player_id, game["mode"]["id"])

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
    def end_game(game_id, player_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            Database.execute(
                "UPDATE games SET time_end = datetime('now') WHERE id = ?",
                (game_id,),
                False
            )
            
            Database.execute("COMMIT")
            
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False
        
    @staticmethod
    def get_game_stats(game_id):
        try:
            cursor = Database.get_cursor()

            cursor.execute("BEGIN TRANSACTION")

            cursor.execute(
                "SELECT * FROM games WHERE id = ?",
                (game_id,)
            )
            game = cursor.fetchone()

            if not game:
                return None

            cursor.execute(
                """
                SELECT players.name, 
                    category.name as category_name,
                    COUNT(player_answers.question_id) as question_count,
                    SUM(answers.is_correct) as total_score,
                    SUM(CASE WHEN answers.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
                    SUM(CASE WHEN answers.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_answers
                FROM player_answers
                JOIN players ON player_answers.player_id = players.id
                JOIN answers ON player_answers.answer_id = answers.id
                JOIN questions ON player_answers.question_id = questions.id
                JOIN category ON questions.category = category.id
                WHERE player_answers.game_id = ?
                GROUP BY players.name, category.name
                """,
                (game_id,)
            )
            player_scores = cursor.fetchall()
            player_scores = [dict(row) for row in player_scores]

            game_stats = {
                "game_id": game_id,
                "time_start": game["time_start"],
                "time_end": game["time_end"],
                "players": {},
            }

            for player in player_scores:
                if player["name"] not in game_stats["players"]:
                    game_stats["players"][player["name"]] = {
                        "total_score": player["total_score"],
                        "correct_answers": player["correct_answers"],
                        "incorrect_answers": player["incorrect_answers"],
                        "categories": {player["category_name"]: player["question_count"]}
                    }
                else:
                    game_stats["players"][player["name"]]["categories"][player["category_name"]] = player["question_count"]

            cursor.connection.commit()

            return game_stats
        except sqlite3.Error as e:
            cursor.connection.rollback()
            print(f"An error occurred: {e}")
            return None
        

    @staticmethod
    def get_round_winners(game_id, question_id):
        query = """
            SELECT players.id, players.name
            FROM player_answers
            JOIN players ON player_answers.player_id = players.id
            JOIN answers ON player_answers.answer_id = answers.id
            WHERE player_answers.game_id = ? AND answers.is_correct = 1 AND player_answers.question_id = ?
        """
        
        params = (game_id, question_id)
        
        try:
            Database.get_cursor().execute(query, params)
            players = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(player) for player in players]
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None


    @staticmethod
    def get_players_by_game(game_id):
        query = """
            SELECT players.*
            FROM player_games
            JOIN players ON player_games.player_id = players.id
            WHERE player_games.game_id = ?
        """
        params = (game_id,)
        try:
            Database.get_cursor().execute(query, params)
            players = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(player) for player in players]
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
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
    def get_player_stats(player_id):
        query = """
            WITH player_stats AS (
                SELECT
                    strftime('%Y-%m-%d', games.time_start) AS date,
                    SUM(CASE WHEN player_games.player_id IS NOT NULL THEN 1 ELSE 0 END) AS games_played,
                    SUM(
                        CASE WHEN player_answers.miss = 1 OR answers.is_correct = 0 THEN 1 ELSE 0 END
                    ) AS questions_wrong,
                    SUM(
                        CASE WHEN player_answers.miss = 0 AND answers.is_correct = 1 THEN 1 ELSE 0 END
                    ) AS questions_correct,
                    SUM(
                        CASE WHEN player_answers.miss = 0 AND answers.is_correct = 1 THEN 1 ELSE 0 END
                    ) AS points
                FROM
                    games
                LEFT JOIN
                    player_games ON games.id = player_games.game_id
                LEFT JOIN
                    player_answers ON games.id = player_answers.game_id AND player_games.player_id = player_answers.player_id
                LEFT JOIN
                    answers ON player_answers.answer_id = answers.id
                WHERE
                    player_games.player_id = ?
                GROUP BY
                    strftime('%Y-%m-%d', games.time_start)
            )
            SELECT
                (
                    SELECT json_group_array(
                        json_object(
                            'date', date,
                            'games_played', games_played,
                            'points', points,
                            'questions_correct', questions_correct,
                            'questions_wrong', questions_wrong
                        )
                    )
                FROM player_stats
                ) AS stats,
                SUM(player_stats.games_played) AS total_games_played,
                SUM(player_stats.points) AS total_points,
                SUM(player_stats.questions_correct) AS total_questions_correct,
                SUM(player_stats.questions_wrong) AS total_questions_wrong,
                (SELECT COUNT(*) FROM friends WHERE player_id = ?) AS total_friends,
                (
                    SELECT json_group_array(
                        json_object(
                            'id', player_badges.badge_id,
                            'name', badges.name
                        )
                    )
                    FROM player_badges
                    JOIN badges ON player_badges.badge_id = badges.id
                    WHERE player_badges.player_id = ?
                ) AS badges,
                (
                    SELECT json_object(
                        'id', tiers.id,
                        'name', tiers.name
                    )
                    FROM tiers
                    JOIN game_rankings ON tiers.id = game_rankings.rank
                    WHERE game_rankings.player_id = ? AND game_rankings.rank = (SELECT MAX(rank) FROM game_rankings WHERE player_id = ?)
                ) AS current_tier,
                (
                    SELECT MAX(rank)
                    FROM game_rankings
                    WHERE player_id = ?
                ) AS current_rank
            FROM
                player_stats;

        """
        params = (player_id, player_id, player_id, player_id, player_id)
        
        try:
            Database.get_cursor().execute(query, params)
            stats = Database.get_cursor().fetchone()
            
            if stats:
                stats_dict = TriviaRepository.row_to_dict(stats)
                stats_dict["stats"] = json.loads(stats_dict["stats"])
                stats_dict["badges"] = json.loads(stats_dict["badges"])
                stats_dict["current_tier"] = json.loads(stats_dict["current_tier"])
                return stats_dict
            else:
                return None

        except Exception as error:
            print(f"Failed to generate statistics: {error}")
            pass

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
    def get_leaderboard():
        query = """
            SELECT rankings.*, players.name, players.total_score
            FROM game_rankings AS rankings
            LEFT JOIN players ON rankings.player_id = players.id
        """

        try:
            Database.get_cursor().execute(query)
            players = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(player) for player in players]
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None

    @staticmethod
    def add_translations(data, language):
        language_id = TriviaRepository.get_language_id(language)
        if not language_id:
            raise ValueError(f"No language found for {language}")

        for question_data in data['questions']:
            question_id = question_data['id']
            translated_question = question_data['question']

            question_insert_query = """
            INSERT INTO question_translations (question_id, language_id, question_text)
            VALUES (?, ?, ?)
            """
            Database.insert(question_insert_query, (question_id, language_id, translated_question))

            for answer_data in question_data['answers']:
                answer_id = answer_data['id']
                translated_answer = answer_data['text']

                answer_insert_query = """
                INSERT INTO answer_translations (answer_id, language_id, answer_text)
                VALUES (?, ?, ?)
                """
                Database.insert(answer_insert_query, (answer_id, language_id, translated_answer))
        
    @staticmethod
    def get_language_id(language_iso_code):
        query = """
        SELECT id FROM language WHERE iso_code = ?
        """
        results = Database.fetchall(query, (language_iso_code,))
        return results[0]['id'] if results else None

    @staticmethod
    def save_report(question_id, player_id, report_type, report):
        # save report to database, uses report_types table to get a matching id

        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            report_sql = """
                INSERT INTO report (player_id, question_id, report_type, report)
                VALUES (?, ?, ?, ?)
            """
            Database.insert(report_sql, (question_id, player_id, report_type, report), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False
        

    @staticmethod
    def get_player_friends(player_id):
        query = """
            SELECT players.id, players.name
            FROM friends
            JOIN players ON friends.friend_id = players.id
            WHERE friends.player_id = ?
        """
        params = (player_id,)
        try:
            Database.get_cursor().execute(query, params)
            friends = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(friend) for friend in friends]
        except sqlite3.Error as error:
            print(f"Failed to read data from table friends: {error}")
            return None 
        
    @staticmethod
    def get_player_friends_invitations(player_id):
        query = """
            SELECT 
                players.id AS player_id, 
                players.name, 
                'sent' AS type
            FROM friend_invitations
            JOIN players ON friend_invitations.friend_id = players.id
            WHERE friend_invitations.player_id = ?

            UNION

            SELECT 
                players.id AS player_id, 
                players.name, 
                'received' AS type
            FROM friend_invitations
            JOIN players ON friend_invitations.player_id = players.id
            WHERE friend_invitations.friend_id = ?
        """
        params = (player_id, player_id)

        try:
            Database.get_cursor().execute(query, params)
            result = Database.get_cursor().fetchall()
            
            invitations = dict()
            invitations['sent'] = []
            invitations['received'] = []

            for invitation in result:
                invitation = TriviaRepository.row_to_dict(invitation)
                invitations[invitation['type']].append(invitation)

            return invitations
        except sqlite3.Error as error:
            print(f"Failed to read data from table friend_invitations: {error}")
            return None
        
    @staticmethod
    def delete_player_friends_invitations(player_id, friend_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            friend_sql = """
                DELETE FROM friend_invitations WHERE player_id = ? AND friend_id = ?
            """
            Database.execute(friend_sql, (player_id, friend_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def invite_friend(player_id, friend_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            friend_sql = """
                INSERT INTO friend_invitations (player_id, friend_id)
                VALUES (?, ?)
            """
            Database.insert(friend_sql, (player_id, friend_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def decline_invite(player_id, friend_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            friend_sql = """
                DELETE FROM friend_invitations WHERE player_id = ? AND friend_id = ?
            """
            Database.execute(friend_sql, (player_id, friend_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def accept_invite(player_id, friend_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            friend_sql = """
                DELETE FROM friend_invitations WHERE player_id = ? AND friend_id = ?
            """
            Database.execute(friend_sql, (friend_id, player_id), False)

            friend_sql = """
                INSERT INTO friends (player_id, friend_id)
                VALUES (?, ?)
            """
            Database.insert(friend_sql, (player_id, friend_id), False)

            friend_sql = """
                INSERT INTO friends (player_id, friend_id)
                VALUES (?, ?)
            """
            Database.insert(friend_sql, (friend_id, player_id), False)

            Database.execute("COMMIT")
            return True
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def search_player_by_string(search_string):
        query = """
            SELECT email, id, name FROM players WHERE name LIKE ?
        """
        params = (f"%{search_string}%",)
        try:
            Database.get_cursor().execute(query, params)
            players = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(player) for player in players]
        except sqlite3.Error as error:
            print(f"Failed to read data from table players: {error}")
            return None

    @staticmethod
    def get_notifications(player_id):
        query = """
            SELECT n.id, n.message, n.read, n.created_at, notification_types.name as name, notification_types.description as description
            FROM notifications as n
            JOIN notification_types ON n.notification_type = notification_types.id
            WHERE n.player_id = ?
        """

        params = (player_id,)

        try:
            Database.get_cursor().execute(query, params)
            notifications = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(notification) for notification in notifications]
        except sqlite3.Error as error:
            print(f"Failed to read data from table notifications: {error}")
            return None
        

    @staticmethod
    def create_notification(player_id, type, message):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            notification_sql = """
                INSERT INTO notifications (player_id, notification_type, message)
                VALUES (?, ?, ?)
            """
            id = Database.insert(notification_sql, (player_id, type, message), False)

            Database.execute("COMMIT")
            
            return id
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def mark_notification_as_read(notification_id, player_id):
        query = """
            UPDATE notifications SET read = 1 WHERE id = ? AND player_id = ?
        """
        params = (notification_id, player_id)

        try:
            Database.get_cursor().execute(query, params)
            Database.get_cursor().connection.commit()
            return True
        except sqlite3.Error as error:
            print(f"Failed to read data from table notifications: {error}")
            return None

    @staticmethod
    def mark_all_notifications_as_read(player_id):
        query = """
            UPDATE notifications SET read = 1 WHERE player_id = ?
        """
        params = (player_id,)

        try:
            Database.get_cursor().execute(query, params)
            Database.get_cursor().connection.commit()
            return True
        except sqlite3.Error as error:
            print(f"Failed to read data from table notifications: {error}")
            return None
        
    @staticmethod
    def get_notification_by_id(id):
        query = """
            SELECT n.id, n.message, n.read, n.created_at, notification_types.name as type, notification_types.description as description
            FROM notifications as n
            JOIN notification_types ON n.notification_type = notification_types.id
            WHERE n.id = ?
        """
        params = (id,)

        try:
            Database.get_cursor().execute(query, params)
            notification = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(notification)
        except sqlite3.Error as error:
            print(f"Failed to read data from table notifications: {error}")
            return None

    @staticmethod
    def get_notification_types():
        pass

    def get_notification_type_by_name(name):
        query = """
            SELECT * FROM notification_types WHERE name = ?
        """
        params = (name,)

        try:
            Database.get_cursor().execute(query, params)
            notification_type = Database.get_cursor().fetchone()
            return TriviaRepository.row_to_dict(notification_type)
        except sqlite3.Error as error:
            print(f"Failed to read data from table notification_types: {error}")
            return None
    
    
    @staticmethod
    def generate_hash(password: str) -> str:
        return generate_password_hash(password)
    
    # Lifelines

    @staticmethod
    def get_lifeline_types():
        try:
            Database.get_cursor().execute("SELECT * FROM lifeline_types")
            lifeline_types = Database.get_cursor().fetchall()
            return [TriviaRepository.row_to_dict(lifeline_type) for lifeline_type in lifeline_types]
        except sqlite3.Error as error:
            print(f"Failed to read data from table lifeline_types: {error}")
            return None
        

    @staticmethod
    def submit_question(question_text, answers, correct_answer, category, language, player_id):
        pass

    @staticmethod
    def submit_category(categoryName, language, player_id):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            category_sql = """
                INSERT INTO category_submission (name, language, player_id)
                VALUES (?, ?, ?)
            """
            Database.insert(category_sql, (categoryName, language, player_id), False)

            Database.execute("COMMIT")
            return True
        
        except sqlite3.Error as e:
            Database.execute("ROLLBACK")
            print(f"An error occurred: {e}")
            return False
