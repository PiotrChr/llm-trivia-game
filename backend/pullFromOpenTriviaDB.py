import requests
import sqlite3
from app.repository.TriviaRepository import TriviaRepository

API_URL = "https://opentdb.com/api.php?amount=50&token=51254982f86d2367c23faf202bc372de9bdfeb763225a94665b4299a1d662a10"

def remap_category(api_category_name):
    mapping_dict = {
        'General Knowledge': None,  # No direct mapping
        'Entertainment: Books': 10,
        'Entertainment: Film': 5,
        'Entertainment: Music': 4,
        'Entertainment: Musicals & Theatres': 90,
        'Entertainment: Television': 21,
        'Entertainment: Video Games': 30,
        'Entertainment: Board Games': 34,
        'Science & Nature': None,  # No direct mapping
        'Science: Computers': 7,
        'Science: Mathematics': 6,
        'Mythology': 52,
        'Sports': 16,
        'Geography': 9,
        'History': 3,
        'Politics': 26,
        'Art': 15,
        'Celebrities': 27,
        'Animals': None,  # No direct mapping
        'Vehicles': 28,
        'Entertainment: Comics': 31,
        'Science: Gadgets': 29,
        'Entertainment: Japanese Anime & Manga': 33,
        'Entertainment: Cartoon & Animations': None  # No direct mapping
    }

    return mapping_dict.get(api_category_name, None)

def get_questions(url):
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data["response_code"] == 0:
            return data["results"]
    return None  

def process_batch(questions):
    # Group questions by category
    categorized_questions = {}
    for question in questions:
        category = remap_category(question["category"])
        if category is not None:  # Ignore questions with unmapped categories
            if category not in categorized_questions:
                categorized_questions[category] = []
            # Remap difficulty
            difficulty = 1 if question["difficulty"] == "easy" else 2 if question["difficulty"] == "medium" else 3
            # Remap answers
            answers = [{"text": question["correct_answer"], "is_correct": True}] + [{"text": answer, "is_correct": False} for answer in question["incorrect_answers"]]
            # Structure question for DB insertion
            formatted_question = {
                "question": question["question"],
                "answers": answers
            }
            categorized_questions[category].append((formatted_question, difficulty))  # Pair of question and difficulty
    return categorized_questions


def main():
    while True:
        try:
            questions = get_questions(API_URL)
            if questions is None:
                print('Error, stopping')
                break  # Stop on error
            categorized_questions = process_batch(questions)
            for category_id, question_difficulty_pairs in categorized_questions.items():
                for question, difficulty in question_difficulty_pairs:
                    TriviaRepository.add_questions([question], category_id, difficulty)  # Single question per DB transaction for varying difficulties within the same category
        except Exception as error:
            print('Exception, stopping', error)
            break


if __name__ == '__main__':
    main()