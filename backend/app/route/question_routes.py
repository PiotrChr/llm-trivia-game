from flask import Blueprint, request, jsonify

from app.repository.TriviaRepository import TriviaRepository

question_routes = Blueprint('question_routes', __name__)


@question_routes.route('/', methods=['GET'])
def get_questions():
    questions = TriviaRepository.get_questions()
    return jsonify(questions), 200

@question_routes.route('/<id>', methods=['GET'])
def get_question(id):
    question = TriviaRepository.get_question_by_id(id)
    if question is None:
        return jsonify({"msg": "Question not found"}), 404
    return jsonify(question), 200

@question_routes.route('/texts/<category_id>/<difficulty>', methods=['GET'])
def get_question_texts(category_id, difficulty):
    question_texts = TriviaRepository.get_questions_texts(category_id, difficulty)
    if question_texts is None:
        return jsonify({"msg": "Question texts not found"}), 404
    return jsonify(question_texts), 200
