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

        print('Initial drawn question:', question)
        
        if question is None:
            question = QuestionManager.try_other_languages_or_generate(game_id, cat_id, category_name, difficulty, language)
            
        return question
        
    @staticmethod
    def try_other_languages_or_generate(game_id, cat_id, category_name, difficulty, language):
        print('Trying other languages or generating new questions')

        if language != 'en':
            questions = TriviaRepository.draw_question(game_id, cat_id, difficulty, 'en', limit=10)
            if questions:
                QuestionManager.handle_translation(questions, language)
                question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)
                if question:
                    return question

        questions = QuestionManager.generate_new_questions(cat_id, category_name, difficulty)
        if language != 'en':
            QuestionManager.handle_translation(questions, language)
        return TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)

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
        try:
            questions = translate_questions(questions, language)
        except:
            print('Error translating.')
            
        return questions
    
    @staticmethod
    def handle_category(category):
        if isinstance(category, str):
            return TriviaRepository.create_category(category)
        else:
            res = TriviaRepository.get_category_by_id(category)
            return res['id'], res['name']

    @staticmethod
    def handle_translation(questions, language):
        print('Translating questions')
        questions = QuestionManager.translate(questions, language)

        print('Adding translations to database')
        try:
            TriviaRepository.add_translations(questions, language)
        except:
            print('Error adding translations to database.')
        
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
