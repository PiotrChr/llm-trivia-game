from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.repository.TriviaRepository import TriviaRepository

player_routes = Blueprint('player_routes', __name__)

# Initialize your repository
trivia_repository = TriviaRepository()

# @player_routes.route('/', methods=['POST'])
# def create_player():
#     data = request.get_json()
#     player_id = trivia_repository.create_player(data['name'])
#     return jsonify(player_id=player_id)


@player_routes.route('/', methods=['GET'])
def get_players():
    players = trivia_repository.get_players()
    return jsonify(players=players)


@player_routes.route('/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = trivia_repository.get_player_by_id(player_id)
    return jsonify(player=player)

@player_routes.route('/stats', methods=['GET'])
@jwt_required()
def get_player_stats():
    player_id = request.args.get('player_id')

    player_stats = trivia_repository.get_player_stats(player_id)
    return jsonify(player_stats=player_stats)


@player_routes.route('/<int:player_id>/answers', methods=['GET'])
def get_player_answers(player_id):
    answers = trivia_repository.get_player_answers(None,player_id)
    return jsonify(answers=answers)

