from flask import Blueprint, request, jsonify, session
from app.repository.TriviaRepository import TriviaRepository
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.service.LifelineManager import LifelineManager

lifeline_routes = Blueprint('lifeline_routes', __name__, url_prefix='/api/lifelines')

@lifeline_routes.route('/types', methods=['GET'])
def get_lifeline_types  ():
    try:
        lifeline_types = TriviaRepository.get_lifeline_types()
        return jsonify(lifeline_types), 200
    except:
        return jsonify({"msg": "Error getting lifeline types"}), 500
    

@lifeline_routes.route('/<int:game_id>/used', methods=['GET'])
@jwt_required()
def get_used_lifelines(game_id):
    player_id = get_jwt_identity()['id']
    try:
        lifelines = TriviaRepository.get_used_lifelines_for_game(player_id, game_id)
        return jsonify(lifelines), 200
    except:
        return jsonify({"msg": "Error getting lifelines"}), 500
    

@lifeline_routes.route('/<int:game_id>/use', methods=['POST'])
@jwt_required()
def use_lifeline(game_id):
    player_id = get_jwt_identity()['id']
    lifeline = request.json['lifeline']
    question_id = request.json['questionId']

    game = TriviaRepository.get_game_by_id(game_id)

    try:
        lifeline_id = TriviaRepository.get_lifeline_id_by_name(lifeline)['id']

        remaining_lifelines = TriviaRepository.get_remaining_lifelines(player_id, game_id, lifeline_id)

        if remaining_lifelines == 0:
            return jsonify({"msg": "No lifelines remaining"}), 400

        TriviaRepository.use_lifeline(player_id, game_id, lifeline_id)

        lifeline_content = LifelineManager.get_lifeline(question_id, lifeline, game['current_language'])

        return jsonify({"msg": "Lifeline used", "lifeline": { "id": lifeline_id, "content": lifeline_content }}), 200
    except Exception as e:
        return jsonify({"msg": "Error using lifeline", "details": e}), 500