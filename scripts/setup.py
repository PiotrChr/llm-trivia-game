import subprocess
import sys

def run_script(script_path):
    try:
        result = subprocess.run(['python', script_path], check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error executing {script_path}: {str(e)}")
        return False

def main():
    scripts = [
        'setup_db.py',
        'setup_env.py'
    ]

    for script in scripts:
        success = run_script(script)
        if not success:
            print(f"Script {script} failed. Stopping setup.")
            sys.exit(1)

    print("Setup completed successfully.")

if __name__ == '__main__':
    main()
