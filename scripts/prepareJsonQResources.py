import json
import sys

def transform_questions(input_file, output_file):
    with open(input_file, 'r') as f:
        questions = json.load(f)

    transformed_questions = []
    for i, q in enumerate(questions):
        transformed_question = {
            "question": q["question"],
            "answers": [{"text": q["answers"][0], "is_correct": True}]
        }
        # # Add dummy incorrect answers
        # transformed_question["answers"].extend([
        #     {"text": "Incorrect answer 1", "is_correct": False},
        #     {"text": "Incorrect answer 2", "is_correct": False},
        #     {"text": "Incorrect answer 3", "is_correct": False},
        # ])
        transformed_questions.append(transformed_question)

    with open(output_file, 'w') as f:
        json.dump(transformed_questions, f, indent=4)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transform_questions.py <input_file.json> <output_file.json>")
        sys.exit(1)

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    transform_questions(input_file_path, output_file_path)