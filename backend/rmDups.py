import json
import argparse
import difflib

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def similar(a, b):
    return difflib.SequenceMatcher(None, a, b).ratio()

def remove_duplicates(data, threshold):
    data = sorted(data, key=lambda x: x['question'].lower())
    unique_data = []
    seen_questions = []
    duplicate_count = 0

    for item in data:
        question = item['question'].strip().lower()
        is_duplicate = False

        for seen_question in seen_questions:
            if similar(question, seen_question) > threshold:
                is_duplicate = True
                duplicate_count += 1
                print(f"Duplicate found and removed: {item['question']} with similarity {similar(question, seen_question)}")
                print (f"to {seen_question} \n")
                break

        if not is_duplicate:
            unique_data.append(item)
            seen_questions.append(question)

    return unique_data, duplicate_count


def print_usage():
    print("""
    Usage: script.py <input_file> <output_file> [--threshold <similarity_threshold>]
    Where:
        <input_file> is the path to the JSON file containing the questions.
        <output_file> is the path where the processed JSON file will be saved.
        --threshold is the optional similarity threshold for detecting duplicates (default is 0.95).
    Example:
        python script.py questions.json cleaned_questions.json --threshold 0.85
    """)

def main():
    parser = argparse.ArgumentParser(description='Process and clean JSON data.')
    parser.add_argument('input_file', type=str, help='Path to the input JSON file')
    parser.add_argument('output_file', type=str, help='Path to the output JSON file')
    parser.add_argument('--threshold', type=float, default=0.95, help='Similarity threshold for detecting duplicates')

    args = parser.parse_args()

    if not args.input_file or not args.output_file:
        print_usage()
        return

    data = load_json(args.input_file)
    cleaned_data, duplicate_count = remove_duplicates(data, args.threshold)
    save_json(cleaned_data, args.output_file)

    print(f"Processed data saved to {args.output_file}.")
    print(f"Total duplicates removed: {duplicate_count}")

if __name__ == "__main__":
    main()