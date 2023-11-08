import os
import sys
from PIL import Image

def convert_png_to_jpg_in_subdir(directory: str) -> None:
    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)
        if file.endswith('.png') and os.path.isfile(file_path):
            jpg_path = os.path.join(directory, file.rstrip('.png') + '.jpg')
            
            try:
                img = Image.open(file_path)
                img = img.convert("RGB")  # Convert RGBA to RGB
                img.save(jpg_path, 'JPEG', quality=80)
                print(f"Converted: {file_path} -> {jpg_path}")
            except Exception as e:
                print(f"Error converting {file_path}. Reason: {e}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python png_to_jpg.py <directory_path>")
        sys.exit(1)

    root_directory = sys.argv[1]
    if not os.path.isdir(root_directory):
        print(f"Error: {root_directory} is not a directory.")
        sys.exit(1)

    for subdir in os.listdir(root_directory):
        full_subdir_path = os.path.join(root_directory, subdir)
        if os.path.isdir(full_subdir_path):
            convert_png_to_jpg_in_subdir(full_subdir_path)

    input("Press Enter to remove all PNG files...")

    for subdir in os.listdir(root_directory):
        full_subdir_path = os.path.join(root_directory, subdir)
        if os.path.isdir(full_subdir_path):
            for file in os.listdir(full_subdir_path):
                file_path = os.path.join(full_subdir_path, file)
                if file.endswith('.png') and os.path.isfile(file_path):
                    try:
                        os.remove(file_path)
                        print(f"Removed: {file_path}")
                    except Exception as e:
                        print(f"Error removing {file_path}. Reason: {e}")

if __name__ == "__main__":
    main()
