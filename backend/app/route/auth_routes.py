from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, current_user

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
    print(player['id'])
    user = User(player['id'], username)
    login_user(user)

    print("Is current user authenticated: " + str(current_user.is_authenticated))

    return jsonify({"msg": "Logged in successfully"}), 200

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
    print("Is auth: " + str(current_user.is_authenticated))
    if not current_user.is_authenticated:
        return jsonify({"msg": "Not logged in"}), 401
    
    return jsonify({"id": current_user.id, "name": current_user.username}), 200

@auth_routes.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"msg": "Logged out successfully"}), 200