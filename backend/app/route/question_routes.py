from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
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

@question_routes.route('/<question_id>/report', methods=['POST'])
@jwt_required()
def report_question(question_id):
    try:
        player_id = get_jwt_identity()['id']
        report_data = request.json.get('reportData', None)
        report_type = report_data.get('reportType', None)
        report = report_data.get('report', None)

        TriviaRepository.save_report(
            question_id,
            player_id,
            report_type,
            report
        )
        return jsonify({"msg": "Question reported"}), 200
    except Exception as error:
        print('Error in report_question:', error)
        return jsonify({"msg": "Error reporting question"}), 500