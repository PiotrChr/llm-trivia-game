# File: scripts/setup_project.py
import os

def prompt_for_data(prompt_message, default_value):
    data = input(prompt_message)
    if data == "":
        return default_value
    return data

def write_to_env_file(filename, data_dict):
    with open(filename, 'w') as f:
        for key, value in data_dict.items():
            f.write(f"{key}={value}\n")

# Prompt for frontend .env data
frontend_port = prompt_for_data("Enter frontend server port (default 8000): ", "8000")
backend_host = prompt_for_data("Enter backend server host URL (default 127.0.0.1): ", "127.0.0.1")
backend_port = prompt_for_data("Enter backend server port (default 9000): ", "9000")

# Write frontend .env data
write_to_env_file("frontend/.env", {
    "REACT_APP_FRONTEND_PORT": frontend_port,
    "REACT_APP_BACKEND_HOST": backend_host,
    "REACT_APP_BACKEND_PORT": backend_port,
})

# Prompt for backend .env data
backend_port = prompt_for_data("Enter backend server port (default 9000): ", "9000")
open_ai_key = prompt_for_data("Enter OpenAI key (default xxx): ", "xxx")

# Write backend .env data
write_to_env_file("backend/.env", {
    "BACKEND_PORT": backend_port,
    "OPENAI_KEY": open_ai_key,
})