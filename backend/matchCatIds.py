import json
import sys
import time
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.backend.env')

from app.repository.OpenAIRepository import match_category_ids

def verify_questions(original_batch, updated_batch):
    # Assuming each question has a unique 'id' and 'content' fields for comparison
    if len(original_batch) != len(updated_batch):
        print(f"Batch size mismatch: Original batch size: {len(original_batch)} \n Updated batch size: {len(updated_batch)}")
        return False
    for original, updated in zip(original_batch, updated_batch):
        if original.get('question') != updated.get('question'):
            print(f"Question didn't match: Original question: {original.get('question')} \n Updated question: {updated.get('question')}")
            return False
    return True

def extract_batch(batch):
    if 'questions' in batch.keys():
        return batch['questions']
    
    return batch

def process_batch_with_retry(batch, retries=3, delay=5):
    attempt = 0
    while attempt < retries:
        try:
            if attempt > 0:
                updated_batch = extract_batch(match_category_ids(batch, model='gpt-4-1106-preview'))
            else:
                updated_batch = extract_batch(match_category_ids(batch))
            
            if verify_questions(batch, updated_batch):
                return updated_batch
            else:
                print("Data mismatch detected. Retrying...")
                attempt += 1
                time.sleep(delay)
        except Exception as e:
            print(f"An error occurred during matching: {e} for the following batch:")
            print(json.dumps(batch))
            print(f"Attempting retry {attempt+1}/{retries}...")
            attempt += 1
            time.sleep(delay)
    
    raise Exception("Failed to match category IDs after retries.")

def read_output_file(output_file):
    try:
        with open(output_file, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def process_questions_in_batches(input_file, output_file, batch_size=40):
    try:
        with open(input_file, 'r') as file:
            questions = json.load(file)

        processed_questions = read_output_file(output_file)
        processed_ids = {q['question'] for q in processed_questions}
        questions_to_process = [q for q in questions if q['question'] not in processed_ids]

        if not questions_to_process:
            print("No new questions to process. Exiting.")
            return

        updated_questions = processed_questions
        total_batches = len(questions_to_process) // batch_size + (1 if len(questions_to_process) % batch_size else 0)
        time_estimates = []

        for i in range(total_batches):
            batch = questions_to_process[i * batch_size:(i + 1) * batch_size]
            print(f"Processing batch {i+1}/{total_batches}...")

            batch_start_time = time.time()
            updated_batch = process_batch_with_retry(batch)
            updated_questions.extend(updated_batch)

            batch_end_time = time.time()
            time_estimates.append(batch_end_time - batch_start_time)

            average_time_per_batch = sum(time_estimates) / len(time_estimates)
            estimated_time_remaining = (average_time_per_batch * (total_batches - (i + 1))) / 60

            with open(output_file, 'w') as file:
                json.dump(updated_questions, file, indent=4)

            print(f"Batch {i+1} processed and written to {output_file}.")
            print(f"Estimated time remaining: {estimated_time_remaining:.2f} minutes.")

    except Exception as e:
        print(f"An unrecoverable error occurred: {e}")

def main():
    if len(sys.argv) != 4:
        print("Usage: matchCatIds.py <batch_size> <input_json_file> <output_json_file>")
        sys.exit(1)
    
    batch_size, input_json_file, output_json_file = int(sys.argv[1]), sys.argv[2], sys.argv[3]
    process_questions_in_batches(input_json_file, output_json_file, batch_size)

if __name__ == "__main__":
    main()