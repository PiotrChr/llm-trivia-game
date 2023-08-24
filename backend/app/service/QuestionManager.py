from app.repository.TriviaRepository import TriviaRepository
from app.repository.OpenAIRepository import get_question, verify_question, translate_questions
import json

class QuestionManager:
    def __init__(self):
        pass

    @staticmethod
    def next_question(game_id, category, difficulty, language):
        print(f'Next question: {game_id}, {category}, {difficulty}, {language}')

        cat_id, category_name = QuestionManager.handle_category(category)

        if not TriviaRepository.set_current_category(game_id, cat_id):
            return False

        question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)

        if question is None:
            if language != 'en':
                questions = TriviaRepository.draw_question(game_id, cat_id, difficulty, 'en', limit=10)
                if questions:
                    QuestionManager.handle_translation(questions, language)
                    question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)

            if question is None:
                questions = QuestionManager.generate_new_questions(cat_id, category_name, difficulty)
                QuestionManager.handle_translation(questions, language)
                question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)

        return question
        
    @staticmethod
    def generate_new_batch(category, difficulty, existing_questions, num_questions):
        try:
            questions = get_question(category, difficulty, existing_questions, num_questions)
        except json.decoder.JSONDecodeError as decodeError:
            print('JSONDecodeError, retrying...')
            questions = get_question(category, difficulty, existing_questions, num_questions)

        # questions = verify_question(questions)

        return questions

    @staticmethod
    def translate(questions, language):
        return translate_questions(questions, language)
    
    @staticmethod
    def handle_category(category):
        if isinstance(category, str):
            return TriviaRepository.create_category(category)
        else:
            res = TriviaRepository.get_category_by_id(category)
            return res['id'], res['name']

    @staticmethod
    def handle_translation(questions, language):
        if language != 'en':
            questions = QuestionManager.translate(questions, language)
            TriviaRepository.add_translations(questions, language)
        return questions


    @staticmethod
    def handle_category(category):
        if isinstance(category, str):
            return TriviaRepository.create_category(category)
        else:
            res = TriviaRepository.get_category_by_id(category)
            return res['id'], res['name']
        
    @staticmethod
    def generate_new_questions(cat_id, category, difficulty):
        existing_questions = TriviaRepository.get_questions_texts(cat_id, difficulty)
        questions = QuestionManager.generate_new_batch(category, difficulty, existing_questions, 2)
        return TriviaRepository.add_questions(questions, cat_id, difficulty)
