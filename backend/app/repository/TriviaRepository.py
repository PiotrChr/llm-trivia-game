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
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_answer_sql = """
                INSERT INTO player_answers (player_id, question_id, game_id, answer_id)
                VALUES (?, ?, ?, ?)
            """
            Database.insert(player_answer_sql, (player_id, question_id, game_id, answer_id), False)

            Database.execute("COMMIT")
            return True
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
        password,
        max_questions,
        host,
        current_category,
        time_limit,
        language='en',
        auto_start=False
    ):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            print(f"Creating game with password: {password}, max_questions: {max_questions}, host: {host}, current_category: {current_category}, time_limit: {time_limit}, language: {language}, auto_start: {auto_start}")

            language_id = Database.get_cursor().execute(
                "SELECT id FROM language WHERE iso_code = ?",
                (language,)
            ).fetchone()["id"]
            
            print(f"Language ID: {language_id}")

            game_sql = """
                INSERT INTO games (password, max_questions, host, current_category, time_limit, current_language, auto_start)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            game_id = Database.insert(game_sql, (password, max_questions, host, current_category, time_limit, language_id, auto_start), False)

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
    def add_points(player_id, points):
        try:
            Database.execute("BEGIN TRANSACTION", commit=False)

            player_game_sql = """
                UPDATE players SET total_score = total_score + ? WHERE id = ?
            """
            Database.execute(player_game_sql, (points, player_id), False)

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
    def get_games():
        query = """
            SELECT games.*, 
            json_group_array(
                json_object('player_id', players.id, 'name', players.name)
            ) as players,
            json_object('id', category.id, 'name', category.name) as current_category
            FROM games
            LEFT JOIN player_games ON games.id = player_games.game_id
            LEFT JOIN players ON player_games.player_id = players.id
            LEFT JOIN category ON games.current_category = category.id
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
                parsed_games.append(game_dict)
            return parsed_games
        except sqlite3.Error as error:
            print(f"Failed to read data from table games: {error}")
            return None


    @staticmethod
    def get_game_by_id(game_id):
        query = """
            SELECT games.*,
            json_group_array(
                json_object('player_id', players.id, 'name', players.name)
            ) as players,
            json_object('id', language.id, 'name', language.name, 'iso_code', language.iso_code) as language,
            json_object('id', category.id, 'name', category.name) as current_category
            FROM games
            LEFT JOIN player_games ON games.id = player_games.game_id
            LEFT JOIN players ON player_games.player_id = players.id
            LEFT JOIN category ON games.current_category = category.id
            LEFT JOIN language ON games.current_language = language.id
            WHERE games.id = ?
        """
        params = (game_id,)

        try:
            Database.get_cursor().execute(query, params)
            game = Database.get_cursor().fetchone()
            if game:
                game_dict = TriviaRepository.row_to_dict(game)
                game_dict["players"] = json.loads(game_dict["players"])
                game_dict["current_category"] = json.loads(game_dict["current_category"])
                game_dict["language"] = json.loads(game_dict["language"])
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
            cursor = Database.get_cursor()

            cursor.execute("BEGIN TRANSACTION", commit=False)

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

            cursor.execute(
                "UPDATE games SET time_end = datetime('now') WHERE id = ?",
                (game_id,),
                False
            )
            
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
            SELECT players.id, players.name, players.total_score, player_categories.category_name
            FROM players
            JOIN (
                SELECT player_answers.player_id as player_id, category.name as category_name, COUNT(player_answers.question_id) as question_count
                FROM player_answers
                JOIN questions ON player_answers.question_id = questions.id
                JOIN category ON questions.category = category.id
                GROUP BY player_answers.player_id, category.name
                ORDER BY question_count DESC
                LIMIT 1
            ) as player_categories ON players.id = player_categories.player_id
            ORDER BY players.total_score DESC
            LIMIT 10
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
            -- Fetch invitations sent by the player
            SELECT 
                players.id AS player_id, 
                players.name, 
                'sent' AS type
            FROM friend_invitations
            JOIN players ON friend_invitations.friend_id = players.id
            WHERE friend_invitations.player_id = ?

            UNION

            -- Fetch invitations received by the player
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
    def get_notifications(notification_id, player_id):
        pass

    @staticmethod
    def mark_notification_as_read(notification_id, player_id):
        pass

    @staticmethod
    def get_notification_types():
        pass

    @staticmethod
    def generate_hash(password: str) -> str:
        return generate_password_hash(password)