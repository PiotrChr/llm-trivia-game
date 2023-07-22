import os
import subprocess

def call_create_tables():
    script_path = os.path.join('backend', 'db', 'create_tables.py')
    subprocess.call(['python', script_path])

if __name__ == "__main__":
    call_create_tables()