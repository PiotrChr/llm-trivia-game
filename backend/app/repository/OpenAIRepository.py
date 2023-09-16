import json
import openai
import os

question_json_structure = """[{"question":"Some example question","answers":[{"text":"answer1","is_correct":true},{"text":"answer2","is_correct":false},{"text":"answer3","is_correct":false},{"text":"answer4","is_correct":false}]},{"question":"Some other example question","answers":[{"text":"answer1","is_correct":false},{"text":"answer2","is_correct":false},{"text":"answer3","is_correct":true},{"text":"answer4","is_correct":false}]}]"""

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

Important! Questions related to Queen (band) are just an example and you shouldn't generate questions covering only this topic. You should generate questions for the given category and difficulty level. Yu should be creative and generate questions that are not too similar to each other. The questions should be logically correct and factually accurate.
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

translation_user_prompt_json_structure = """
{"language":"en","target_language":"pl","questions":[{"question":"Some example question","id":1,"answers":[{"id":123,"text":"answer1","is_correct":true},{"id":222,"text":"answer2","is_correct":false},{"id":23,"text":"answer3","is_correct":false},{"id":98,"text":"answer4","is_correct":false}]},{"question":"Some other example question","id":23,"answers":[{"id":12,"text":"answer1","is_correct":false},{"id":64,"text":"answer2","is_correct":false},{"id":1252,"text":"answer3","is_correct":true},{"id":998,"text":"answer4","is_correct":false}]}]}
"""

translated_prompt_json_structure = """
{"language":"en","target_language":"pl","questions":[{"question":"Jakies przykladowe pytanie","id":1,"answers":[{"id":123,"text":"Odpowiedz 1","is_correct":true},{"id":222,"text":"Odpowiedz 2","is_correct":false},{"id":23,"text":"Odpowiedz 3","is_correct":false},{"id":98,"text":"Odpowiedz 4","is_correct":false}]},{"question":"Jakies inne przykladowe pytanie","id":23,"answers":[{"id":12,"text":"Odpowiedz 1","is_correct":false},{"id":64,"text":"Odpowiedz 2","is_correct":false},{"id":1252,"text":"Odpowiedz 3","is_correct":true},{"id":998,"text":"Odpowiedz 4","is_correct":false}]}]}
"""

translation_system_prompt = f"""
You're tasked with translating json array with trivia questions. Your responses should be strictly in JSON format and should follow the structure given below:
{translation_user_prompt_json_structure}
Language is a string with the target language name. Questions are an array of questions and answers in the source language. The answers should be translated as well.

In a following messages I'll send a json object with the language, target_language and questions (array) you should translate.
You should translate the questions and answers to the target language and reply with the json object containing the translated questions and answers.
Your response should be strictly in JSON format and should follow the structure given below: 
{translated_prompt_json_structure}

Do not add any commentary to the reply.

Example of a correct reply:
{translated_prompt_json_structure}
"""

fix_json_system_prompt = f"""
You're tasked with fixing broken/incomplete json with questions and answers for a trivia game. Messages with questions will be formatted as follows:
{question_json_structure}

However the given json may be malformed and you have to fix it keeping in mind the required questions structure.
In a following messages I'll send malformed json object.

Your response should be strictly in JSON format and should follow the structure given below:
{question_json_structure}

Do not add any commentary to the reply.

Example of a correct reply:
{question_json_structure}
"""

openai.api_key = os.getenv('OPENAI_KEY')
MODEL = os.getenv('MODEL')
TEMPERATURE = float(os.getenv('TEMPERATURE'))

# openai.organization = os.getenv('OPENAI_ORG_ID')

def chat_completion(messages, temperature = TEMPERATURE):
    data = {
        "model": MODEL,
        "messages": messages,
        "temperature": temperature,
    }

    try:
        response = openai.ChatCompletion.create(**data)
        content = response['choices'][0]['message']['content'].strip()

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
    

def translate_questions(questions, taget_language, current_language = 'en'):
    init_system_prompt = {
        "role": "system",
        "content": translation_system_prompt
    }

    user_message = {
        "role": "user",
        "content": json.dumps({
            "language": current_language,
            "target_language": taget_language,
            "questions": questions
        })
    }

    messages = [init_system_prompt, user_message]

    try:
        response = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in verify_question:', error)
        raise error
    

def fix_question_json(questions_json):
    init_system_prompt = {
        "role": "system",
        "content": translation_system_prompt
    }

    user_message = {
        "role": "user",
        "content": json.dumps({
            "questions_json": questions_json
        })
    }

    messages = [init_system_prompt, user_message]

    try:
        response = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in fix_question_json:', error)
        raise error
    
