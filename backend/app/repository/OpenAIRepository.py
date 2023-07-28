import requests
import json
import openai
from dotenv import load_dotenv
import os

load_dotenv()

question_json_structure = """[{"question":"Some example question","answers":[{"text":"answer1","is_correct":"true"},{"text":"answer2","is_correct":"false"},{"text":"answer3","is_correct":"false"},{"text":"answer4","is_correct":"false"}]},{"question":"Some other example question","answers":[{"text":"answer1","is_correct":"false"},{"text":"answer2","is_correct":"false"},{"text":"answer3","is_correct":"true"},{"text":"answer4","is_correct":"false"}]}]"""

user_prompt_json_structure = """{"category": category, "difficulty": difficulty, "num_questions": num_questions, "existing_questions": ["Some other example question", "Some example question", "Some different example question"]}"""

answer_init_prompt = """
--- Here are difficulty: (difficulty level in text) questions about (category). ---
"""

default_system_prompt = f"""
You are tasked with creating trivia questions for a given category and difficulty level. Your responses should be strictly in JSON format and should follow the structure given below:
{question_json_structure}

In a following messages I'll send a json object with the category, difficulty, number of questions you should generate and array of already existing questions.
None of the questions you generate should be in the existing questions array or be simmilar to them.
Difficulty is an integer between 1 and 5, inclusive. Number of questions is an integer between 1 and 50, inclusive.
Difficulty levels are defined as follows:

1. **Easy (Truly Trivial)**: General, widely-known information or concepts that almost everyone should know. The answers at this level should be fairly obvious. Example: "Who was the lead singer of the band Queen?"
2. **Medium**: More specific information that someone familiar with the subject might know. The incorrect answers should also sound plausible to make the question more challenging. Example: "What was Queen's first number-one single in the United States?"
3. **Hard**: Requires detailed knowledge of the subject. The context of these questions should significantly differ from each other within the same batch. Example: "What was the B-side to Queen's first number-one single in the United States?"
4. **Very Hard**: Only someone with in-depth, specialized knowledge of the subject will likely know the answer. The questions should focus on obscure facts or very specific details. Example: "Which Queen song features a skiffle band using instruments made out of household objects?"
5. **Impossible (Obscure Facts)**: Extremely obscure information that even enthusiasts of the subject might not know. The answer should be verifiable. Example: "Which member of Queen wrote the least number of songs for the band?"

Important! Higher difficulty levels should have more difficult questions and the answers should be and sound as more plausible. The context of the questions should not be too similar to each other in the same batch.

My messages will be formatted as follows:
{user_prompt_json_structure}

All questions and answers should be logically correct and factually accurate.
Questions should not repeat.
"""

verification_system_prompt = f"""
You're tasked with validating json array with trivia questions. Your responses should be strictly in JSON format and should follow the structure given below:
Here is the json array with the trivia questions you generated. Please verify that the questions are logically and factually correct and that the answers are plausible. If there are mistakes in the question set, please correct them and reply with the json array with corrected questions/answers.
If the questions are correct, send unchanged json array containing questions.
Questions will be formatted as follows:
{question_json_structure}

Your answer should be strictly in JSON format and should follow the structure given above. Do not add any commentary to the reply.
Example of a correct reply:
{question_json_structure}

Important! If you do not reply with a valid JSON array, the system will not be able to process your response and you will not be able to continue.
"""

openai.api_key = os.getenv('OPENAI_KEY')
# openai.organization = os.getenv('OPENAI_ORG_ID')

def chat_completion(messages):
    data = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.9,
    }

    try:
        response = openai.ChatCompletion.create(**data)
        print('raw', response)
        content = response['choices'][0]['message']['content'].strip()
        # # strips the first line and \n\n from the top of res string
        # content = content[content.find('\n\n') + 2:]
        
        return content
        
    except Exception as error:
        print('Error in chatCompletion:', error)
        raise error

def get_question(category, difficulty, existing_questions=[], num_questions=1):
    init_system_prompt = {
        "role": "system",
        "content": default_system_prompt
    }

    message_content = json.dumps({
            "category": category, 
            "difficulty": difficulty,
            "num_questions": num_questions,
            "existing_questions": existing_questions
        })

    print('message_content', message_content)

    user_message = {
        "role": "user",
        "content": message_content
    }

    messages = [init_system_prompt, user_message]

    try:
        response = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in get_question:', error)
        raise error
    
def verify_question(question_json):
    # initial system message
    init_system_prompt = {
        "role": "system",
        "content": verification_system_prompt
    }

    user_message = {
        "role": "user",
        "content": json.dumps(question_json)
    }

    messages = [init_system_prompt, user_message]

    try:
        response = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in verify_question:', error)
        raise error