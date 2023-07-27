import argparse
from app.repository.OpenAIRepository import get_question, verify_question

def pretty_print_question(question_dict):
    print("\nQuestion: ", question_dict["question"])
    for idx, answer in enumerate(question_dict["answers"]):
        letter = chr(97 + idx)  # 97 is ASCII value for 'a'
        print(f"{letter}. {answer}")
    print("\nCorrect Answer: ", question_dict["correct_answer"])
    print("\n" + "-" * 50 + "\n")  # Divider line

def main(args):
    category = args.category
    language = args.language
    difficulty = args.difficulty
    num_questions = args.num_questions

    result = get_question(category, difficulty, num_questions)
    print("Got results")
    for question in result:
        pretty_print_question(question)
    
    # verified_result = verify_question(result)
    # print("Got verified results")
    # for question in verified_result:
    #     pretty_print_question(question)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate trivia questions')
    parser.add_argument('--category', type=str, help='The category of the question')
    parser.add_argument('--language', type=str, help='The language of the question')
    parser.add_argument('--difficulty', type=int, help='The difficulty level of the question')
    parser.add_argument('--num_questions', type=int, help='The number of questions to generate', default=1)
    args = parser.parse_args()
    main(args)