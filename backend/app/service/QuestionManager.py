from app.repository.TriviaRepository import TriviaRepository
from app.repository.OpenAIRepository import get_question, verify_question
import random

class QuestionManager:
    def __init__(self):
        pass

    @staticmethod
    def next_question(game_id, category, difficulty):
        res = TriviaRepository.get_category_by_name(category)

        if res is None:
            cat_id = TriviaRepository.create_category(category)
        else:
            cat_id = res['id']

        if not TriviaRepository.set_current_category(game_id, cat_id):
            return False
        
        question = TriviaRepository.draw_question(game_id, cat_id, difficulty)

        if question is None:
            existing_questions = TriviaRepository.get_questions_texts(game_id, cat_id, difficulty)

            questions = QuestionManager.generate_new_batch(category, difficulty, existing_questions, 20)
            TriviaRepository.add_questions(game_id, questions, cat_id, difficulty)

            question = QuestionManager.draw_one(questions)

        return question
        
    @staticmethod
    def generate_new_batch(category, difficulty, existing_questions, num_questions):
        questions = get_question(category, difficulty, existing_questions, num_questions)

        verified_questions = verify_question(questions)

        return verified_questions

    @staticmethod
    def draw_one(questions):
        return questions[random.randint(0, len(questions) - 1)]


        
    
