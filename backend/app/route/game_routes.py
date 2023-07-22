from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository

game_routes = Blueprint('game_routes', __name__)

@game_routes.route('/create', methods=['POST'])
def create_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    player_ids = request.json.get('player_ids', None)
    is_timed = request.json.get('is_timed', False)
    time_limit = request.json.get('time_limit', None)

    if not player_ids:
        return jsonify({"msg": "Missing player_ids parameter"}), 400

    trivia_repository = TriviaRepository()
    game_id = trivia_repository.create_game(player_ids, is_timed, time_limit)

    return jsonify({"msg": "Game created successfully", "game_id": game_id}), 201

@game_routes.route('/end', methods=['POST'])
def end_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    game_id = request.json.get('game_id', None)

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    trivia_repository = TriviaRepository()
    game_ended = trivia_repository.end_game(game_id)

    if game_ended:
        return jsonify({"msg": "Game ended successfully", "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error ending game", "game_id": game_id}), 500


@game_routes.route('/stats', methods=['GET'])
def get_game_stats():
    game_id = request.args.get('game_id')

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    trivia_repository = TriviaRepository()
    game_stats = trivia_repository.get_game_stats(game_id)

    if game_stats is None:
        return jsonify({"msg": "No stats found for this game_id"}), 404
    else:
        return jsonify(game_stats), 200