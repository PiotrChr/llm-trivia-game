import argparse
from dotenv import load_dotenv

load_dotenv(dotenv_path='.backend.env')

from app.service.QuestionManager import QuestionManager

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fill database with new questions')
    parser.add_argument('--num_questions', type=int, required=True, help='Number of questions to generate for each category')
    parser.add_argument('--start_cat_id', type=int, required=False, help='ID of the category from which you would like to start generation', default=0)
    parser.add_argument('--difficulty', type=int, required=False, help='Difficulty (1-3), default: 1(easy))', default=1)

    args = parser.parse_args()

    QuestionManager.fill_database_with_new_questions(args.num_questions, args.start_cat_id, args.difficulty)