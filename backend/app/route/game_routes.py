from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit
from flask import current_app

game_routes = Blueprint('game_routes', __name__)

@game_routes.route('/', methods=['GET'])
def get_games():
    games = TriviaRepository.get_games(isPublic=True)
    return jsonify(games), 200


@game_routes.route('/<game_id>', methods=['GET'])
# @jwt_required()
def get_game_by_id(game_id):
    game = TriviaRepository.get_game_by_id(game_id)
    return jsonify(game), 200

@game_routes.route('/modes', methods=['GET'])
def get_modes():
    modes = TriviaRepository.get_game_modes()
    return jsonify(modes), 200

@game_routes.route('/create', methods=['POST'])
@jwt_required()
def create_game():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    time_limit = request.json.get('timeLimit', None)
    max_questions = request.json.get('maxQuestions', None)
    host = get_jwt_identity()['id']
    current_category = request.json.get('currentCategory', None)
    all_categories = request.json.get('allCategories', None)
    auto_start = request.json.get('autoStart', False)
    language = request.json.get('language', 'en')
    game_mode = request.json.get('gameMode', None)
    eliminate_on_fail = request.json.get('eliminateOnFail', False)
    selected_lifelines = request.json.get('selectedLifelines', None)
    is_public = request.json.get('isPublic', False)
    max_players = request.json.get('maxPlayers', 10)

    print(f'Creating game with params: {request.json}')

    if all_categories is True:
        print('Getting random category')
        cat_id = TriviaRepository.get_random_category()['id']
    else:
        if not isinstance(current_category, str):
            cat_id = current_category
        else:
            # cat_id = TriviaRepository.create_category(current_category)
            pass

    password = request.json.get('password', None)

    game_id = None
    try:
        game_id = TriviaRepository.create_game(
            game_mode,
            password,
            max_questions,
            host,
            cat_id,
            all_categories,
            time_limit,
            language,
            auto_start,
            eliminate_on_fail,
            selected_lifelines,
            is_public,
            max_players
        )
    except Exception as e:
        print(e)
        return jsonify({"msg": "Error creating game"}), 500

    if game_id is None:
        return jsonify({"msg": "Error creating game"}), 500

    return jsonify({"msg": "Game created successfully", "id": game_id}), 201


@game_routes.route('/start', methods=['POST'])
@jwt_required()
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
    
@game_routes.route('/start_server', methods=['GET'])
@jwt_required()
def start_server():
    game_id = request.args.get('game_id')

@game_routes.route('/join', methods=['POST'])
@jwt_required()
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
    
    print(f'Player {player_id} joining game {game_id}')
    player_joined = TriviaRepository.player_join(player_id, game_id)

    if player_joined:
        socketio = current_app.extensions['socketio']
        socketio.emit('player_added_to_game', {'player_id': player_id, 'game_id': game_id}, to=game_id)

        return jsonify({"msg": "Player joined successfully", "player_id": player_id, "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error joining player", "player_id": player_id, "game_id": game_id}), 500

@game_routes.route('/<game_id>/is_playing', methods=['GET'])
@jwt_required()
def is_playing(game_id):
    player_id = get_jwt_identity()['id']

    is_playing = TriviaRepository.is_playing(game_id, player_id)

    return jsonify({"msg": "Player is playing", "player_id": player_id, "game_id": game_id, "playing": is_playing}), 200
    

@game_routes.route('/end_game', methods=['POST'])
@jwt_required()
def end_game():
    player_id = get_jwt_identity()['id']

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    game_id = request.json.get('gameId', None)

    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game = TriviaRepository.get_game_by_id(game_id)
    player = TriviaRepository.get_player_by_id(player_id)

    if game is None:
        return jsonify({"msg": "Game not found", "game_id": game_id}), 404
    
    if player is None:
        return jsonify({"msg": "Player not found", "player_id": player_id}), 404
    
    if game['host'] != player_id:
        return jsonify({"msg": "Player is not the host", "player_id": player_id}), 401

    game_ended = TriviaRepository.end_game(game_id)

    if game_ended:
        return jsonify({"msg": "Game ended successfully", "game_id": game_id}), 200
    else:
        return jsonify({"msg": "Error ending game", "game_id": game_id}), 500


@game_routes.route('/<game_id>/stats', methods=['GET'])
@jwt_required()
def get_game_stats(game_id):
    if game_id is None:
        return jsonify({"msg": "Missing game_id parameter"}), 400

    game_stats = TriviaRepository.get_game_stats(game_id)

    if game_stats is None:
        return jsonify({"msg": "No stats found for this game_id"}), 404
    else:
        return jsonify(game_stats), 200


@game_routes.route('/<game_id>/players', methods=['GET'])
def get_players_by_game(game_id):
    players = TriviaRepository.get_players_by_game(game_id)

    if players is None:
        return jsonify({"msg": "No players found for this game_id"}), 404
    else:
        return jsonify(players), 200


@game_routes.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    leaderboard = TriviaRepository.get_leaderboard()

    if leaderboard is None:
        return jsonify({"msg": "No leaderboard found"}), 404
    else:
        return jsonify(leaderboard), 200
    