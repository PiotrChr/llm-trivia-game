from app.repository.TriviaRepository import TriviaRepository
import json

class LifelineManager:
    def __init__(self):
        pass

    @staticmethod
    def get_hint(question_id, language):
        return TriviaRepository.get_hint(question_id, language)

    @staticmethod
    def get_lifeline(question_id, lifeline_type, language='en'):

        print(f'Getting lifeline {lifeline_type} for question {question_id}')

        try:
            if lifeline_type == 'hint':
                return LifelineManager.get_hint(question_id, language)
            return True
        except:
            return False
