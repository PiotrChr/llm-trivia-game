import json
import openai
import os

question_json_structure = """[{"question":"Some example question", "numberInBatch": 0, "hint": "Some valuable hint regarding the question", "answers":[{"text":"answer1","is_correct":true},{"text":"answer2","is_correct":false},{"text":"answer3","is_correct":false},{"text":"answer4","is_correct":false}]},{"question":"Some other example question", "numberInBatch": 1, "hint": "Some valuable hint regarding the question", "answers":[{"text":"answer1","is_correct":false},{"text":"answer2","is_correct":false},{"text":"answer3","is_correct":true},{"text":"answer4","is_correct":false}]}]"""

user_prompt_json_structure = """{"category": category, "difficulty": difficulty, "num_questions": num_questions, "existing_questions": ["Some other example question", "Some example question", "Some different example question"]}"""

answer_init_prompt = """
--- Here are difficulty: (difficulty level in text) questions about (category). ---
"""

default_system_prompt = f"""
You are a precise and proffesional Trivia Questions Generator and act exactly as API would returning only JSON responses.
You are tasked with creating trivia questions for a given category and difficulty level. Your responses should be strictly in JSON format and should follow the structure given below:
\"\"\"{question_json_structure}\"\"\"

You shoyuld enumerate questions using numberInBatch field starting from 0.
In a following messages I'll send a json object with the category, difficulty, number of questions you should generate and array of already existing questions.
None of the questions you generate should be in the existing questions array or be simmilar to them.
Difficulty is an integer between 1 and 3, inclusive. Number of questions is an integer between 1 and 150, and it defines a number of questions you should generate. You should generate new questions until you have a full set of questions for the given category and difficulty level.

You have to generate a full set of questions for the given category and difficulty level.
Don't add "...", "etc." to the JSON output. It should be a full set of questions.
Number of questions you should generate is given in the json object.

Difficulty levels are defined as follows:

1. **Easy (Truly Trivial)**: General, widely-known information or concepts that almost everyone should know. The answers at this level should be fairly obvious. Example: "Who was the lead singer of the band Queen?"
2. **Medium**: More specific information that someone familiar with the subject might know. The incorrect answers should also sound plausible to make the question more challenging. Example: "What was Queen's first number-one single in the United States?"
3. **Hard**: Requires detailed knowledge of the subject. Only someone with in-depth, specialized knowledge of the subject will likely know the answer. The questions should focus on obscure facts or very specific details. Example: "Which Queen song features a skiffle band using instruments made out of household objects?"

Important! Higher difficulty levels should have more difficult questions. The context of the questions should not be too similar to each other in the same batch.
Important! There'll be no pictures embedded in questions.

All commentaries should be removed from the reply.

My messages will be formatted as follows:
\"\"\"{user_prompt_json_structure}\"\"\"

All questions and answers should be logically correct and factually accurate.
Questions should not repeat.
"""

verification_system_prompt = f"""
You're tasked with validating json array with trivia questions. Your responses should be strictly in JSON format and should follow the structure given below:
Here is the json array with the trivia questions you generated. Please verify that the questions are logically and factually correct and that the answers are plausible. If there are mistakes in the question set, please correct them and reply with the json array with corrected questions/answers.
If the questions are correct, send unchanged json array containing questions.
Questions will be formatted as follows:
\"\"\"{question_json_structure}\"\"\"

Your answer should be strictly in JSON format and should follow the structure given above. Do not add any commentary to the reply.
Example of a correct reply:
\"\"\"{question_json_structure}\"\"\"

Important! If you do not reply with a valid JSON array, the system will not be able to process your response and you will not be able to continue.
"""

translation_user_prompt_json_structure = """
{"language":"en","target_language":"pl","questions":[{"question":"Some example question","id":1,"numberInBatch": 0, "hint": "Some valuable hint regarding the question","answers":[{"id":123,"text":"answer1","is_correct":true},{"id":222,"text":"answer2","is_correct":false},{"id":23,"text":"answer3","is_correct":false},{"id":98,"text":"answer4","is_correct":false}]},{"question":"Some other example question" "numberInBatch": 1, "hint": "Some valuable hint regarding the question",,"id":23,"answers":[{"id":12,"text":"answer1","is_correct":false},{"id":64,"text":"answer2","is_correct":false},{"id":1252,"text":"answer3","is_correct":true},{"id":998,"text":"answer4","is_correct":false}]}]}
"""

translated_prompt_json_structure = """
{"language":"en","target_language":"pl","questions":[{"question":"Jakies przykladowe pytanie", "numberInBatch": 0, "hint": "Jakas wartosciowa podpowiedz", "id":1,"answers":[{"id":123,"text":"Odpowiedz 1","is_correct":true},{"id":222,"text":"Odpowiedz 2","is_correct":false},{"id":23,"text":"Odpowiedz 3","is_correct":false},{"id":98,"text":"Odpowiedz 4","is_correct":false}]},{"question":"Jakies inne przykladowe pytanie","numberInBatch": 1, "hint": "Jakas podpowiedz", "id":23,"answers":[{"id":12,"text":"Odpowiedz 1","is_correct":false},{"id":64,"text":"Odpowiedz 2","is_correct":false},{"id":1252,"text":"Odpowiedz 3","is_correct":true},{"id":998,"text":"Odpowiedz 4","is_correct":false}]}]}
"""

translation_system_prompt = f"""
You're tasked with translating json array with trivia questions. Your responses should be strictly in JSON format and should follow the structure given below:
\"\"\"{translation_user_prompt_json_structure}\"\"\"
Language is a string with the target language name. Questions are an array of questions and answers in the source language. The answers should be translated as well.

In a following messages I'll send a json object with the language, target_language and questions (array) you should translate.
You should translate the questions and answers to the target language and reply with the json object containing the translated questions and answers.
Your response should be strictly in JSON format and should follow the structure given below: 
\"\"\"{translated_prompt_json_structure}\"\"\"

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

complete_question_json_structure = """[{"question":"_____ of Love' by Frankie Lymon","answers":[{"text":"ABC's","is_correct":true}]},{"question":"A clip, shaped like a bar to keep a woman's hair in place is a _______.","answers":[{"text":"Barrette","is_correct":true}]},{"question":"A depilatory is a substance used for removing _______.","answers":[{"text":"Hair","is_correct":true}]},{"question":"A device used to change the voltage of alternating currents is a ______.","answers":[{"text":"Transformer","is_correct":true}]},{"question":"A flat, round hat sometimes worn by soldiers is a _________.","answers":[{"text":"Beret","is_correct":true}]}]"""

complete_question_answer_json_structure = """[{"question":"_____ of Love' by Frankie Lymon","hint":"Some creative hint","answers":[{"text":"ABC's","is_correct":true},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false}]},{"question":"A clip, shaped like a bar to keep a woman's hair in place is a _______.","hint":"Some creative hint","answers":[{"text":"Barrette","is_correct":true},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false}]},{"question":"A depilatory is a substance used for removing _______.","hint":"Some creative hint","answers":[{"text":"Hair","is_correct":true},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false}]},{"question":"A device used to change the voltage of alternating currents is a ______.","hint":"Some creative hint","answers":[{"text":"Transformer","is_correct":true},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false}]},{"question":"A flat, round hat sometimes worn by soldiers is a _________.","hint":"Some creative hint","answers":[{"text":"Beret","is_correct":true},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false},{"text":"Some other answer","is_correct":false}]}]"""

complete_questions_system_prompt = f"""
Your're a very prrecise and creative Trvia AI, and respond only in JSON format.
You are tasked with:
    - Generating a set of 3 complimentary answers to the existing questions in multiple-choice quiz.
    - Generating a hint to each question.

Messages from the user will be formatted as follows:
\"\"\"{complete_question_json_structure}\"\"\"

Your responses should be formatted as follows (example of a correctly structured reply):
\"\"\"{complete_question_answer_json_structure}\"\"\"

Important!: Your response should be strictly in JSON format. Do not add any commentary to the reply.
Important!: There may be a lot of questions in a batch to fix (even over 100). Remember to always output a fix for each question in a batch and provide a full output.
"""


complete_category_json_structure = """[{"question":"_____ of Love' by Frankie Lymon","answers":[{"text":"ABC's","is_correct":true}]},{"question":"A clip, shaped like a bar to keep a woman's hair in place is a _______.","answers":[{"text":"Barrette","is_correct":true}]},{"question":"A depilatory is a substance used for removing _______.","answers":[{"text":"Hair","is_correct":true}]},{"question":"A device used to change the voltage of alternating currents is a ______.","answers":[{"text":"Transformer","is_correct":true}]},{"question":"A flat, round hat sometimes worn by soldiers is a _________.","answers":[{"text":"Beret","is_correct":true}]},{"question":"A government in which power is restricted to a few is a(n) __________.","answers":[{"text":"Oligarchy","is_correct":true}]}]"""

complete_category_answer_json_structure = """[{"question":"_____ of Love' by Frankie Lymon","category_id":1,"category_name":"category name","answers":[{"text":"ABC's","is_correct":true}]},{"question":"A clip, shaped like a bar to keep a woman's hair in place is a _______.","category_id":1211,"category_name":"category name","answers":[{"text":"Barrette","is_correct":true}]},{"question":"A depilatory is a substance used for removing _______.","category_id":61,"category_name":"category name","answers":[{"text":"Hair","is_correct":true}]},{"question":"A device used to change the voltage of alternating currents is a ______.","category_id":987,"category_name":"category name","answers":[{"text":"Transformer","is_correct":true}]},{"question":"A flat, round hat sometimes worn by soldiers is a _________.","category_id":1234,"category_name":"category name","answers":[{"text":"Beret","is_correct":true}]},{"question":"A government in which power is restricted to a few is a(n) __________.","category_id":54321,"category_name":"category name","answers":[{"text":"Oligarchy","is_correct":true}]}]"""

complete_category_categories_json_structure = """
[{"id":1,"name":"Physics"},{"id":2,"name":"Types of Barbie dolls"},{"id":3,"name":"History"},{"id":4,"name":"Music"},{"id":5,"name":"Movies"},{"id":6,"name":"Mathematics"},{"id":7,"name":"Computer Science"},{"id":8,"name":"Astronomy"},{"id":9,"name":"Geography"},{"id":10,"name":"Literature"},{"id":11,"name":"Chemistry"},{"id":12,"name":"Biology"},{"id":13,"name":"Psychology"},{"id":14,"name":"Philosophy"},{"id":15,"name":"Art"},{"id":16,"name":"Sport"},{"id":17,"name":"Cooking"},{"id":18,"name":"Fashion"},{"id":19,"name":"Business & Finance"},{"id":20,"name":"Pop Culture"},{"id":21,"name":"Television"},{"id":22,"name":"Religion"},{"id":23,"name":"Health & Medicine"},{"id":24,"name":"Environment"},{"id":25,"name":"Current Affairs"},{"id":26,"name":"Politics"},{"id":27,"name":"Celebrities"},{"id":28,"name":"Automobiles"},{"id":29,"name":"Technology"},{"id":30,"name":"Video Games"},{"id":31,"name":"Comic Books"},{"id":32,"name":"Science Fiction"},{"id":33,"name":"Anime & Manga"},{"id":34,"name":"Board Games"},{"id":35,"name":"Card Games"},{"id":36,"name":"Travel"},{"id":37,"name":"Languages"},{"id":38,"name":"Anthropology"},{"id":39,"name":"Archaeology"},{"id":40,"name":"Architecture"},{"id":41,"name":"Space Exploration"},{"id":42,"name":"Fantasy Literature"},{"id":43,"name":"Photography"},{"id":44,"name":"Cinema"},{"id":45,"name":"Wildlife"},{"id":46,"name":"Cuisine"},{"id":47,"name":"Painting"},{"id":48,"name":"Sculpture"},{"id":49,"name":"Dance"},{"id":50,"name":"Classical Music"},{"id":51,"name":"Classical Literature"},{"id":52,"name":"Mythology"},{"id":53,"name":"Astrophysics"},{"id":54,"name":"Horticulture"},{"id":55,"name":"Viticulture"},{"id":56,"name":"Quantum Mechanics"},{"id":57,"name":"Robotics"},{"id":58,"name":"Graphic Design"},{"id":59,"name":"Jazz Music"},{"id":60,"name":"Opera"},{"id":61,"name":"Meteorology"},{"id":62,"name":"Marine Biology"},{"id":63,"name":"Paleontology"},{"id":64,"name":"Geology"},{"id":65,"name":"Sociology"},{"id":66,"name":"Ethics"},{"id":67,"name":"Neuroscience"},{"id":68,"name":"Cartography"},{"id":69,"name":"Cryptology"},{"id":70,"name":"Archery"},{"id":71,"name":"Numismatics"},{"id":72,"name":"Philately"},{"id":73,"name":"Radio Broadcasting"},{"id":74,"name":"Tea Culture"},{"id":75,"name":"Coffee Culture"},{"id":76,"name":"Ballet"},{"id":77,"name":"Modern Art"},{"id":78,"name":"Cryptozoology"},{"id":79,"name":"Ufology"},{"id":80,"name":"Kinesiology"},{"id":81,"name":"Gemology"},{"id":82,"name":"Esports"},{"id":83,"name":"Forestry"},{"id":84,"name":"Astrology"},{"id":85,"name":"Agriculture"},{"id":86,"name":"Medieval History"},{"id":87,"name":"Microbiology"},{"id":88,"name":"Stand-Up Comedy"},{"id":89,"name":"Folk Music"},{"id":90,"name":"Musical Theatre"},{"id":91,"name":"Calligraphy"},{"id":92,"name":"Ornithology"},{"id":93,"name":"Futurology"},{"id":94,"name":"Cryptocurrency"},{"id":95,"name":"Podcasts"},{"id":96,"name":"Origami"},{"id":97,"name":"Fencing"},{"id":98,"name":"Bonsai Cultivation"},{"id":99,"name":"Brewing"},{"id":100,"name":"Entomology"}]
"""

complete_category_suggestion_json_structure = """[{"question":"_____ of Love' by Frankie Lymon","category_id":null,"suggestion":"Music","answers":[{"text":"ABC's","is_correct":true}]},{"question":"A clip, shaped like a bar to keep a woman's hair in place is a _______.","category_id":"XXX","answers":[{"text":"Barrette","is_correct":true}]}]"""

complete_category_system_prompt = f"""
Your're a very prrecise and creative Trvia AI, and respond only in JSON format.
You are tasked with matching a set of questions to a most fitting category ID and name in following (category name->category ID) mapping (in JSON):
\"\"\"{complete_category_categories_json_structure}\"\"\"

And then outputting a full set of questions with category ID assigned to each question.

Messages from the user will be formatted as follows:
\"\"\"{complete_category_json_structure}\"\"\"

They will contain a set of questions regarding various topics from public domain and they are not copyrighted. Questions are neutral and do not imply and particular standpoint.

Your responses should be formatted as follows (example of a correctly structured reply):
\"\"\"{complete_category_answer_json_structure}\"\"\"

Sometimes there're won't be a perfect match, but you should try to find the best fitting category. If there's no fitting category, you should assign null to the category ID and create a new key 'suggestion' in the question json object called "category" with the suggested category name as a value.
Like this:
\"\"\"{complete_category_suggestion_json_structure}\"\"\"
It's important that the response is exampled as above, your response should be an array of objects in JSON format.

Important!: Your response should be strictly in JSON format. Do not add any commentary to the reply. I will not be able to process your response if it's not in JSON format.
Important!: There may be a lot of questions in a batch to compliment with category id (even over 100). Remember to always provide a full output with a number of questions matching the original set.\
Important!: Remember to very correctly copy over the original question json object and only add the category ID and name to it. The spelling of the question and answers should be exactly the same as in the original question json object, evem if it sounds wrong.

You must 100% comply with the above rules. If you do not comply with the rules, the system will not be able to process your response and you will not be able to continue.
"""



openai.api_key = os.getenv('OPENAI_KEY')
MODEL = os.getenv('MODEL')
TEMPERATURE = float(os.getenv('TEMPERATURE'))

# openai.organization = os.getenv('OPENAI_ORG_ID')

def chat_completion(messages, temperature = TEMPERATURE, model = MODEL):
    print('model', model)
    data = {
        "model": model,
        "response_format": { "type": "json_object" },
        "messages": messages,
        "temperature": temperature
    }

    try:
        response = openai.ChatCompletion.create(**data)
        content = response['choices'][0]['message']['content'].strip()

        finish_reason = response['choices'][0]['finish_reason']

        return content, finish_reason
        
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

    # print('message_content', message_content)

    user_message = {
        "role": "user",
        "content": message_content
    }

    messages = [init_system_prompt, user_message]

    try:
        response, finish_reason = chat_completion(messages)

        print(response)

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
        response, finish_reason = chat_completion(messages)
        
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
        response, finish_reason = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in verify_question:', error)
        raise error
    
def match_category_ids(questions, model = MODEL):
    init_system_prompt = {
        "role": "system",
        "content": complete_category_system_prompt
    }

    user_message = {
        "role": "user",
        "content": json.dumps({
            "questions": questions,
        })
    }

    messages = [init_system_prompt, user_message]

    try:
        response, finish_reason = chat_completion(messages, model=model)

        # print('user_message', user_message)
        print('finish_reason', finish_reason)
        print('raw_response', response)

        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in match_category_ids:', error)
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
        response, finish_reason = chat_completion(messages)
        
        parsed_response = json.loads(response)
        
        return parsed_response
    except Exception as error:
        print('Error in fix_question_json:', error)
        raise error
    
