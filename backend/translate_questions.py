import argparse
import json
import logging

import dotenv
dotenv.load_dotenv('../.backend.env')

from app.repository.TriviaRepository import TriviaRepository
from app.repository.OpenAIRepository import translate_questions
import time

def load_existing_translations(output_file, failed_file):
    try:
        with open(output_file, 'r') as file:
            translated = json.load(file)
    except FileNotFoundError:
        translated = []

    try:
        with open(failed_file, 'r') as file:
            failed = json.load(file)
    except FileNotFoundError:
        failed = []

    return translated, failed

def save_data(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def main(output_file, failed_output_file, target_language, category_id=None, batch_size=10):
    logging.basicConfig(level=logging.INFO)
    translated_questions, failed_translations = load_existing_translations(output_file, failed_output_file)

    translated_ids = set(q['id'] for q in translated_questions)
    failed_ids = set(failed_translations)

    questions_to_translate = TriviaRepository.get_untranslated_questions(target_language, category_id)
    
    total_questions = len(questions_to_translate)
    start_time = time.time()

    for i in range(0, total_questions, batch_size):
        batch = questions_to_translate[i:i + batch_size]
        batch_ids = set(q['id'] for q in batch)

        # Filter out already processed questions
        batch = [q for q in batch if q['id'] not in translated_ids and q['id'] not in failed_ids]

        if not batch:
            continue

        try:
            translated_batch, finish_reason = translate_questions(batch, target_language)

            print(f"Translated batch starting at index {i}")
            print(translated_batch)

            translated_questions.extend(translated_batch['questions'])
            translated_ids.update(batch_ids)
        except Exception as e:
            logging.error(f"Failed to translate batch starting at index {i}: {e}")
            failed_translations.extend(batch_ids)

        save_data(translated_questions, output_file)
        save_data(failed_translations, failed_output_file)

        # Time estimation
        elapsed_time = time.time() - start_time
        questions_processed = i + len(batch)
        avg_time_per_question = elapsed_time / questions_processed
        estimated_time_left = (avg_time_per_question * (total_questions - questions_processed)) / 3600
        logging.info(f"Processed {questions_processed}/{total_questions}. Estimated time remaining: {estimated_time_left:.2f} hours")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Translate trivia questions to a target language.")
    parser.add_argument("output_file", help="Path to save translated questions")
    parser.add_argument("failed_output_file", help="Path to save failed translations")
    parser.add_argument("target_language", help="Target language for translation")
    parser.add_argument("--category_id", type=int, help="Category ID to filter questions", default=None)
    parser.add_argument("--batch_size", type=int, help="Number of questions per translation batch", default=10)
    args = parser.parse_args()

    main(args.output_file, args.failed_output_file, args.target_language, args.category_id, args.batch_size)

    # Run with the following command:
    # python3 translate_questions.py output.json failed.json es --category_id 9 --batch_size 10
