import os
import sys

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'BMP', 'SVG', 'ICO']

def rename_files_in_directory(directory):
    files: list[str] = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)) and f.endswith(tuple(ALLOWED_EXTENSIONS))]
    for idx, file in enumerate(sorted(files), 1):
        old_path = os.path.join(directory, file)
        new_path = os.path.join(directory, f"{idx}.{file.split('.')[-1]}")
        try:
            os.rename(old_path, new_path)
            print(f"Renamed: {old_path} -> {new_path}")
        except Exception as e:
            print(f"Error renaming {old_path} to {new_path}. Reason: {e}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <directory_path>")
        sys.exit(1)

    root_directory = sys.argv[1]
    if not os.path.isdir(root_directory):
        print(f"Error: {root_directory} is not a directory.")
        sys.exit(1)

    for subdir in os.listdir(root_directory):
        full_subdir_path = os.path.join(root_directory, subdir)
        if os.path.isdir(full_subdir_path):
            rename_files_in_directory(full_subdir_path)

if __name__ == "__main__":
    main()