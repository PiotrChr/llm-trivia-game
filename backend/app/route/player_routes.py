from flask import Blueprint, request, jsonify

from app.repository.TriviaRepository import TriviaRepository

player_routes = Blueprint('player_routes', __name__)

# Initialize your repository
trivia_repository = TriviaRepository()

@player_routes.route('/player', methods=['POST'])
def create_player():
    data = request.get_json()
    player_id = trivia_repository.create_player(data['name'])
    return jsonify(player_id=player_id)