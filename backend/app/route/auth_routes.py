from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user

from backend.app.repository.TriviaRepository import TriviaRepository
from backend.app.models import User

auth_routes = Blueprint('auth_routes', __name__, url_prefix='/api/auth')

@auth_routes.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    trivia_repository = TriviaRepository()
    player = trivia_repository.get_player_by_name(username)
    if player is None or not TriviaRepository.check_hash(player['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401

    user = User(player['id'], username)
    login_user(user)

    return jsonify({"msg": "Logged in successfully"}), 200

@auth_routes.route('/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    hashed_password = TriviaRepository.generate_hash(password)

    trivia_repository = TriviaRepository()
    trivia_repository.create_player(username, hashed_password)

    return jsonify({"msg": "User created successfully"}), 201

@auth_routes.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"msg": "Logged out successfully"}), 200