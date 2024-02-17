import json
import argparse
import logging
import time
from app.repository.TriviaRepository import TriviaRepository
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv(dotenv_path='.backend.env')

def load_json_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def append_failed_batch_to_file(failed_batch, file_path="db_insert_failed.json"):
    try:
        with open(file_path, 'r+') as file:
            data = json.load(file)
            data.append(failed_batch)
            file.seek(0)
            json.dump(data, file, indent=4)
    except FileNotFoundError:
        with open(file_path, 'w') as file:
            json.dump([failed_batch], file, indent=4)

def group_questions_by_category(json_data):
    grouped_questions = defaultdict(list)
    for item in json_data:
        category_id = item.get("category_id")
        grouped_questions[category_id].append(item)
    return grouped_questions

def populate_db_with_questions(grouped_questions, difficulty, batch_size=10, language='en'):
    start_time = time.time()
    total_questions = sum(len(questions) for questions in grouped_questions.values())

    for category_id, questions in grouped_questions.items():
        for i in range(0, len(questions), batch_size):
            batch = questions[i:i + batch_size]
            try:
                questions_with_ids = TriviaRepository.add_questions(batch, category_id, difficulty)
                for question in questions_with_ids:
                    if "hint" in question:
                        TriviaRepository.add_hint(question['id'], question["hint"], language)

                # Time estimation
                elapsed_time = time.time() - start_time
                questions_processed = min(i + batch_size, len(questions))
                questions_left = total_questions - questions_processed
                avg_time_per_question = elapsed_time / questions_processed
                estimated_time_left = avg_time_per_question * questions_left
                logging.info(f"Processed {questions_processed}/{total_questions} questions. Estimated time remaining: {estimated_time_left:.2f} seconds")
                
            except Exception as e:
                logging.error(f"Error adding batch: {e}")
                append_failed_batch_to_file(batch)
                continue

    return True

def main(input_file):
    logging.basicConfig(level=logging.INFO)
    json_data = load_json_data(input_file)
    grouped_questions = group_questions_by_category(json_data)

    difficulty = 2 

    if populate_db_with_questions(grouped_questions, difficulty):
        logging.info("All questions added successfully.")
    else:
        logging.error("Some questions failed to add.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Populate trivia database with questions.")
    parser.add_argument("input_file", help="Path to the JSON file containing questions")
    args = parser.parse_args()

    main(args.input_file)
