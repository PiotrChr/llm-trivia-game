import json
import argparse
import logging
import difflib
import time

def load_json_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json_data(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def merge_questions(source1, source2, similarity_threshold=0.95):
    matched_indexes = set()  # Set to keep track of matched indexes from source2
    merged_questions = []
    failed_questions = []
    start_time = time.time()

    for index, q1 in enumerate(source1):
        matched = False
        for i, q2 in enumerate(source2):
            if i in matched_indexes:  # Skip if already matched
                continue
            similarity = difflib.SequenceMatcher(None, q1["question"].lower(), q2["question"].lower()).ratio()
            if similarity > similarity_threshold:
                merged_questions.append({
                    "question": q1["question"],
                    "hint": q2.get("hint", ""),
                    "category_id": q1["category_id"],
                    "answers": q2.get("answers", []),
                })
                matched_indexes.add(i)  # Mark this index as matched
                matched = True
                break
        if not matched:
            failed_questions.append(q1)

        # Log estimated time to completion
        elapsed_time = time.time() - start_time
        questions_left = len(source1) - (index + 1)
        if index > 0 and questions_left > 0:
            avg_time_per_question = elapsed_time / (index + 1)
            estimated_time_left = avg_time_per_question * questions_left
            logging.info(f"Processed {index + 1}/{len(source1)} questions. Estimated time remaining: {estimated_time_left:.2f} seconds")

    return merged_questions, failed_questions

def main(input_file1, input_file2, output_file, failed_output_file):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    data_source1 = load_json_data(input_file1)
    data_source2 = load_json_data(input_file2)

    merged, failed = merge_questions(data_source1, data_source2)
    
    save_json_data(merged, output_file)
    save_json_data(failed, failed_output_file)

    logging.info(f"Merged questions saved to {output_file}")
    logging.info(f"Failed to merge questions saved to {failed_output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Merge trivia questions from two JSON sources.")
    parser.add_argument("input_file1", help="Path to the first JSON file")
    parser.add_argument("input_file2", help="Path to the second JSON file")
    parser.add_argument("output_file", help="Path to save merged questions")
    parser.add_argument("failed_output_file", help="Path to save questions that failed to merge")
    args = parser.parse_args()

    main(args.input_file1, args.input_file2, args.output_file, args.failed_output_file)
