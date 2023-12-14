import json
import sys
import time
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.backend.env')

from app.repository.OpenAIRepository import match_category_ids

def verify_questions(original_batch, updated_batch):
    mismatched_questions = []
    for original, updated in zip(original_batch, updated_batch):
        if original.get('question') != updated.get('question'):
            mismatched_questions.append(original)
    return mismatched_questions

def extract_batch(batch):
    if 'questions' in batch.keys():
        return batch['questions']
    
    return batch

def split_batch(batch):
    mid_index = len(batch) // 2
    return batch[:mid_index], batch[mid_index:]

# def handle_content_filter(batch, retries, delay):
#     first_half, second_half = split_batch(batch)
#     first_half_result, first_half_failed = retry_process_batch(first_half, retries, delay)
#     second_half_result, second_half_failed = retry_process_batch(second_half, retries, delay)
#     return first_half_result + second_half_result, first_half_failed + second_half_failed

def retry_process_batch(batch, retries, delay):
    for attempt in range(retries):
        result, failed_questions = process_single_attempt(batch, attempt, delay)
        if result is not None:
            return result, failed_questions
        time.sleep(delay)
    return None, failed_questions

def process_single_attempt(batch, attempt, delay):
    try:
        result, finish_reason = match_category_ids(batch)
        updated_batch = extract_batch(result)
        mismatched_questions = verify_questions(batch, updated_batch)
        if not mismatched_questions:
            return updated_batch, [], finish_reason
        else:
            return None, mismatched_questions, finish_reason
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, batch, 'unknown'

def process_batch_with_retry(batch, retries=3, delay=5):
    finish_reason = None
    content_filter_triggered = 0

    for attempt in range(retries):
        result, failed_questions, finish_reason = process_single_attempt(batch, attempt, delay)
        if len(failed_questions) == 0:
            return result, [], False

        if finish_reason == 'content_filter':
            content_filter_triggered += 1
            # if content_filter_triggered < retries:
            #     return handle_content_filter(batch, retries, delay), True

    if content_filter_triggered == retries:
        print(f"Batch failed due to content filter {retries} times. Saving to separate file.")
        return None, batch, True
    else:
        return None, failed_questions, False

def read_output_file(output_file):
    try:
        with open(output_file, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(' Couldn\'t read output file: ', e, output_file)
        return []

def process_questions_in_batches(input_file, output_file, failed_batch_file, content_filter_file, batch_size=40):
    try:
        with open(input_file, 'r') as file:
            print(f"Reading questions from {input_file}...")
            questions = json.load(file)
            
        failed_questions = read_output_file(failed_batch_file)
        failed_ids = {q['question'] for q in failed_questions}
        
        content_filter_questions = read_output_file(content_filter_file)
        content_filtered_ids = {q['question'] for q in content_filter_questions}
        
        processed_questions = read_output_file(output_file)
        processed_ids = {q['question'] for q in processed_questions}
        
        questions_to_process = [q for q in questions if q['question'] not in processed_ids and q['question'] not in failed_ids and q['question'] not in content_filtered_ids]

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
            updated_batch, batch_failed_questions, content_filter_triggered = process_batch_with_retry(batch)
            time.sleep(1)

            if updated_batch is not None:
                updated_questions.extend(updated_batch)

            if batch_failed_questions:
                if content_filter_triggered:
                    with open(content_filter_file, 'a') as cf_file:
                        content_filter_questions.extend(batch_failed_questions)
                        json.dump(content_filter_questions, cf_file, indent=4)
                else:
                    with open(failed_batch_file, 'w') as file:
                        failed_questions.extend(batch_failed_questions)
                        json.dump(failed_questions, file, indent=4)

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
    if len(sys.argv) != 3:
        print("Usage: matchCatIds.py <batch_size> <input_json_file>")
        sys.exit(1)

    batch_size, input_json_file = int(sys.argv[1]), sys.argv[2]
    file_dir = os.path.dirname(input_json_file)
    base_name = os.path.splitext(os.path.basename(input_json_file))[0]
    
    output_file = os.path.join(file_dir, f"{base_name}_output.json")
    failed_batch_file = os.path.join(file_dir, f"{base_name}_failed.json")
    content_filter_file = os.path.join(file_dir, f"{base_name}_content_filter.json")

    process_questions_in_batches(input_json_file, output_file, failed_batch_file, content_filter_file, batch_size)

if __name__ == "__main__":
    main()