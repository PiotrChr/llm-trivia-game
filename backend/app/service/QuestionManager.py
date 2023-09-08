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
    def fill_database_with_new_questions(num_questions, start_category_id=None):
        categories = TriviaRepository.get_categories()
        difficulty = 1
        
        for category in categories:
            cat_id = category['id']

            if start_category_id is not None and cat_id < start_category_id:
                continue

            category_name = category['name']
            existing_questions = TriviaRepository.get_questions_texts(cat_id, difficulty)
                
            print(f'Generating {num_questions} new questions for {category_name}...')
            try:
                questions = QuestionManager.generate_new_batch(category_name, difficulty, existing_questions, num_questions)
                TriviaRepository.add_questions(questions, cat_id, difficulty)
                print(f'Added {num_questions} new questions for {category_name} to the database')
            except Exception as e:
                print(f'Error generating or adding questions for {category_name}: {e}')

    @staticmethod
    def try_other_languages_or_generate(game_id, cat_id, category_name, difficulty, language):
        print('Trying other languages or generating new questions')
        print (f'game_id: {game_id}, cat_id: {cat_id}, category_name: {category_name}, difficulty: {difficulty}, language: {language}')

        if language != 'en':
            questions = TriviaRepository.draw_question(game_id, cat_id, difficulty, 'en', limit=10)
            if questions:
                print('Found questions in English, translating...')
                print('questions:', questions)
                QuestionManager.handle_translation(questions, language)

                print('Translation handled')
                question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)
                if question:
                    return question

        print('Generating new questions')
        questions = QuestionManager.generate_new_questions(cat_id, category_name, difficulty)
        if language != 'en':
            print('Translating fresh questions')
            QuestionManager.handle_translation(questions, language)

        return TriviaRepository.draw_question(game_id, cat_id, difficulty, language, limit=1)

    @staticmethod
    def generate_new_batch(category, difficulty, existing_questions, num_questions):
        try:
            print('Getting questions')
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
        except Exception as error:
            print('Error adding translations to database: ', error)
        
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
        print('Existing questions:', existing_questions)

        print('New batch')
        questions = QuestionManager.generate_new_batch(category, difficulty, existing_questions, 2)
        return TriviaRepository.add_questions(questions, cat_id, difficulty)
