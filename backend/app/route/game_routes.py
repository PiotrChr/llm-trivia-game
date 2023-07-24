from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository

game_routes = Blueprint('game_routes', __name__)

@game_routes.route('/create', methods=['POST'])
def create_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    time_limit = request.json.get('time_limit', None)
    max_questions = request.json.get('max_questions', None)
    host = request.json.get('host', None)
    current_category = request.json.get('current_category', None)
    password = request.json.get('password', None)
    
    trivia_repository = TriviaRepository()
    game_id = trivia_repository.create_game(
        password,
        max_questions,
        host,
        current_category,
        time_limit
    )

    return jsonify({"msg": "Game created successfully", "game_id": game_id}), 201


@game_routes.route('/player_join', methods=['POST'])
def player_join():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    player_id = request.json.get('player_id', None)
    game_id = request.json.get('game_id', None)

    if player_id is None:
        return jsonify({"msg": "Missing player_id parameter"}), 400
    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    trivia_repository = TriviaRepository()
    player_joined = trivia_repository.player_join(player_id, game_id)

    if player_joined:
        return jsonify({"msg": "Player joined successfully", "player_id": player_id, "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error joining player", "player_id": player_id, "game_id": game_id}), 500


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