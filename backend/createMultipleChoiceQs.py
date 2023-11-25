import sys
import os
import time
from app.repository.OpenAIRepository import add_hints_and_multiple_choice

def process_questions_in_batches(input_json_file, output_file, failed_batch_file, content_filter_file, batch_size):
    pass



def main():
    if len(sys.argv) != 3:
        print("Usage: createMultipleChoiceQs.py <batch_size> <input_json_file>")
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