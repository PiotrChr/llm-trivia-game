import requests
import json
import openai
from dotenv import load_dotenv
import os

load_dotenv()

question_json_structure = """
{"question": "Some example question", "answers": ["answer1", "answer2", "answer3", "answer4"], "correct_answer": "answer1"}
"""

def generate_init_prompt(category, langauge, difficulty, num_questions):
    pass

openai.api_key = os.getenv('OPENAI_API_KEY')
openai.organization = os.getenv('OPENAI_ORG_ID')

def chat_completion(messages):
    data = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
    }

    try:
        response = openai.ChatCompletion.create(**data)
        print('raw', response.data)
        return response['choices'][0]['message']['content'].strip()
    except Exception as error:
        print('Error in chatCompletion:', error)
        raise error

def get_question(category, language, difficulty):
    pass