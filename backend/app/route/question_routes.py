from flask import Blueprint, request, jsonify

from backend.app.repository.TriviaRepository import TriviaRepository

question_routes = Blueprint('question_routes', __name__)

trivia_repository = TriviaRepository()

@question_routes.route('/questions', methods=['GET'])
def get_questions():
    # This function should return all questions.
    # You should implement a method like get_all_questions() in your TriviaRepository class.
    questions = trivia_repository.get_all_questions()
    return jsonify(questions), 200

@question_routes.route('/questions/<id>', methods=['GET'])
def get_question(id):
    # This function should return a single question.
    # You should implement a method like get_question(id) in your TriviaRepository class.
    question = trivia_repository.get_question(id)
    if question is None:
        return jsonify({"msg": "Question not found"}), 404
    return jsonify(question), 200

@question_routes.route('/questions', methods=['POST'])
def create_question():
    # This function should create a new question.
    # You should implement a method like create_question(question, category, correct_answer, wrong_answers) 
    # in your TriviaRepository class.
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    question = request.json.get('question', None)
    category = request.json.get('category', None)
    correct_answer = request.json.get('correct_answer', None)
    wrong_answers = request.json.get('wrong_answers', None)

    if not question or not category or not correct_answer or not wrong_answers:
        return jsonify({"msg": "Missing required parameters"}), 400

    trivia_repository.create_question(question, category, correct_answer, wrong_answers)
    return jsonify({"msg": "Question created successfully"}), 201