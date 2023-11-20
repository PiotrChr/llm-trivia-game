from flask import Blueprint, request, jsonify, session
from app.repository.TriviaRepository import TriviaRepository
from flask_jwt_extended import jwt_required, get_jwt_identity

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