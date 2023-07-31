import os
import re
import shutil

# Regular expression pattern to match the category name
pattern = re.compile(r'^(.*?)(\d+)?\.jpeg$')

# Iterate over all files in the current directory
for filename in os.listdir():
    # Check if the file is a JPEG image
    if filename.endswith('.jpeg'):
        # Determine the corresponding category using the regular expression
        match = pattern.match(filename)
        if match:
            category_name = match.group(1)

            # Iterate over directories to find the matching one
            for directory in os.listdir():
                # Check if the directory name matches the category name, ignoring the case
                if directory.lower() == category_name.lower().replace(' ', '_'):
                    # Move the file to the corresponding directory
                    destination_path = os.path.join(directory, filename)
                    shutil.move(filename, destination_path)
                    print(f"Moved {filename} to {destination_path}")
                    break
            else:
                print(f"Warning: No matching directory found for {filename}")
        else:
            print(f"Warning: Unable to determine category for {filename}")
