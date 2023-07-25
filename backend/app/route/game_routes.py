from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import join_room, leave_room, SocketIO, send, emit

game_routes = Blueprint('game_routes', __name__)

@game_routes.route('/', methods=['GET'])
def get_games():
    games = TriviaRepository.get_games()
    return jsonify(games), 200


@game_routes.route('/<game_id>', methods=['GET'])
@jwt_required()
def get_game_by_id(game_id):
    game = TriviaRepository.get_game_by_id(game_id)
    return jsonify(game), 200

@game_routes.route('/create', methods=['POST'])
@jwt_required()
def create_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    time_limit = request.json.get('timeLimit', None)
    max_questions = request.json.get('maxQuestions', None)
    host = get_jwt_identity()['id']
    current_category = request.json.get('currentCategory', None)
    password = request.json.get('password', None)
    
    game_id = TriviaRepository.create_game(
        password,
        max_questions,
        host,
        current_category,
        time_limit
    )

    if game_id is None:
        return jsonify({"msg": "Error creating game"}), 500

    return jsonify({"msg": "Game created successfully", "id": game_id}), 201


@jwt_required()
@game_routes.route('/start', methods=['POST'])
def start_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    game_id = request.json.get('game_id', None)
    password = request.json.get('password', None)

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game = TriviaRepository.get_game_by_id(game_id)
    if game is None:
        return jsonify({"msg": "Game not found", "game_id": game_id}), 404
    if game['password'] != password:
        return jsonify({"msg": "Incorrect password", "game_id": game_id}), 401

    game_started = TriviaRepository.start_game(game_id)

    if game_started:
        return jsonify({"msg": "Game started successfully", "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error starting game", "game_id": game_id}), 500
    
@jwt_required()
@game_routes.route('/start_server', methods=['GET'])
def start_server():
    game_id = request.args.get('game_id')

@jwt_required()
@game_routes.route('/join', methods=['POST'])
def player_join():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    player_id = get_jwt_identity()['id']
    game_id = request.json.get('game_id', None)
    password = request.json.get('password', None)

    if player_id is None:
        return jsonify({"msg": "Missing player_id parameter"}), 400
    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game = TriviaRepository.get_game_by_id(game_id)
    if game is None:
        return jsonify({"msg": "Game not found", "game_id": game_id}), 404
    if game['password'] != password:
        return jsonify({"msg": "Incorrect password", "game_id": game_id}), 401
    

    player_joined = TriviaRepository.player_join(player_id, game_id)

    if player_joined:
        return jsonify({"msg": "Player joined successfully", "player_id": player_id, "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error joining player", "player_id": player_id, "game_id": game_id}), 500

@jwt_required()
@game_routes.route('/is_playing', methods=['GET'])
def is_playing():
    game_id = request.args.get('game_id')
    player_id = get_jwt_identity()['id']

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    is_playing = TriviaRepository.is_playing(game_id, player_id)

    return jsonify({"msg": "Player is playing", "player_id": player_id, "game_id": game_id, "playing": is_playing}), 200
    

@game_routes.route('/end', methods=['POST'])
def end_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    game_id = request.json.get('game_id', None)

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game_ended = TriviaRepository.end_game(game_id)

    if game_ended:
        return jsonify({"msg": "Game ended successfully", "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error ending game", "game_id": game_id}), 500


@game_routes.route('/stats', methods=['GET'])
def get_game_stats():
    game_id = request.args.get('game_id')

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game_stats = TriviaRepository.get_game_stats(game_id)

    if game_stats is None:
        return jsonify({"msg": "No stats found for this game_id"}), 404
    else:
        return jsonify(game_stats), 200


