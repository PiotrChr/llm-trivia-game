import argparse
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.backend.env')

from app.service.QuestionManager import QuestionManager

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fill database with new questions')
    parser.add_argument('--language', type=int, required=True, help='Number of questions to generate for each category')
    parser.add_argument('--cat', type=int, required=False, help='ID of the category from which you would like to start generation')

    args = parser.parse_args()

    QuestionManager.translate()
