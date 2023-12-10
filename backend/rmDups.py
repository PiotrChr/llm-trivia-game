import json
import argparse
import difflib
import numpy as np
import time

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def similar(a, b):
    length_difference_threshold = 5
    if abs(len(a) - len(b)) > length_difference_threshold:
        return 0

    return difflib.SequenceMatcher(None, a, b).ratio()

def remove_duplicates(data, threshold):
    data = sorted(data, key=lambda x: x['question'].lower() if 'question' in x else '')
    data = list(filter(lambda x: 'question' in x and x['question'] != '', data))
    
    data_array = np.array(data)
    to_delete = []
    total_time = 0

    for i in range(len(data_array)):
        start_time = time.time()
        if i in to_delete:
            continue

        if ('question' not in data_array[i]):
            print(f"Question not found: {data_array[i]}")
            exit(1)
        
        question = data_array[i]['question'].strip().lower()

        for j in range(i + 1, len(data_array)):
            if j in to_delete:
                continue

            next_question = data_array[j]['question'].strip().lower()
            similarity = similar(question, next_question)
            if similarity > threshold:
                print(f"Duplicate found and removed: {data_array[j]['question']}")
                to_delete.append(j)
            elif similarity < 0.8:
                break

        iteration_time = time.time() - start_time
        total_time += iteration_time
        average_time_per_iteration = total_time / (i + 1)
        remaining_iterations = len(data_array) - i - 1
        estimated_time_remaining = average_time_per_iteration * remaining_iterations

        print(f"Remaining questions: {remaining_iterations}")
        print(f"Questions to remove: {len(to_delete)}")
        print(f"Estimated time to end: {estimated_time_remaining / 60:.2f} minutes")

    unique_data = np.delete(data_array, to_delete)

    return unique_data.tolist(), len(to_delete)

def main():
    parser = argparse.ArgumentParser(description='Process and clean JSON data.')
    parser.add_argument('input_file', type=str, help='Path to the input JSON file')
    parser.add_argument('output_file', type=str, help='Path to the output JSON file')
    parser.add_argument('--threshold', type=float, default=0.95, help='Similarity threshold for detecting duplicates')

    args = parser.parse_args()

    data = load_json(args.input_file)
    cleaned_data, duplicate_count = remove_duplicates(data, args.threshold)
    save_json(cleaned_data, args.output_file)

    print(f"Processed data saved to {args.output_file}.")
    print(f"Total duplicates removed: {duplicate_count}")

if __name__ == "__main__":
    main()