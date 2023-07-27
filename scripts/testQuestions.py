import argparse
from app.repository.OpenAIRepository import get_question

def main(args):
    category = args.category
    language = args.language
    difficulty = args.difficulty
    num_questions = args.num_questions

    result = get_question(category, language, difficulty, num_questions)
    print(result)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate trivia questions')
    parser.add_argument('--category', type=str, help='The category of the question')
    parser.add_argument('--language', type=str, help='The language of the question')
    parser.add_argument('--difficulty', type=str, help='The difficulty level of the question')
    parser.add_argument('--num_questions', type=int, help='The number of questions to generate', default=1)
    args = parser.parse_args()
    main(args)