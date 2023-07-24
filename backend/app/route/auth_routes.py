from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, verify_jwt_in_request

from app.repository.TriviaRepository import TriviaRepository
from app.models.User import User

auth_routes = Blueprint('auth_routes', __name__, url_prefix='/api/auth')


@auth_routes.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    email = request.json.get('email', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    
    trivia_repository = TriviaRepository()
    player = trivia_repository.get_player_by_name(username)

    print(username)
    print(player)

    if player is None or not TriviaRepository.check_hash(player['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401
    
    identity = {
        "id": player['id'],
        "name": player['name']
    }

    access_token = create_access_token(identity=identity)  # Create an access token
    refresh_token = create_refresh_token(identity=identity)  # Create a refresh token

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


@auth_routes.route('/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    email = request.json.get('email', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400

    hashed_password = TriviaRepository.generate_hash(password)

    trivia_repository = TriviaRepository()

    if trivia_repository.get_player_by_name(username) is not None:
        return jsonify({"msg": "Username already exists"}), 400

    trivia_repository.create_player(username, email, hashed_password)
    
    return jsonify({"msg": "User created successfully"}), 201


@auth_routes.route('/check', methods=['GET'])
def check():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    user = TriviaRepository.get_player_by_id(user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"id": user.id, "name": user.username}), 200


@auth_routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)
