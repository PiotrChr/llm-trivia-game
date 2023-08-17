from app.repository.TriviaRepository import TriviaRepository
from app.repository.OpenAIRepository import get_question, verify_question
import random
import json

class QuestionManager:
    def __init__(self):
        pass

    @staticmethod
    def next_question(game_id, category, difficulty, language):
        print(f'Next question: {game_id}, {category}, {difficulty}, {language}')
        
        if isinstance(category, str):
            cat_id = TriviaRepository.create_category(category)
        else:
            res = TriviaRepository.get_category_by_id(category)
            cat_id = res['id']
            category = res['name']

        if not TriviaRepository.set_current_category(game_id, cat_id):
            return False
        
        question = TriviaRepository.draw_question(game_id, cat_id, difficulty, language)

        if question is None:
            existing_questions = TriviaRepository.get_questions_texts(cat_id, difficulty)
            print(game_id, cat_id, difficulty)
            print(f'Existing questions: {existing_questions}')

            questions = QuestionManager.generate_new_batch(category, difficulty, existing_questions, 2)
            questions = TriviaRepository.add_questions(questions, cat_id, difficulty)

            question = TriviaRepository.draw_question(game_id, cat_id, difficulty)

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
