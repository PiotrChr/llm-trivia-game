import os
from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from app.repository.TriviaRepository import TriviaRepository
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
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
    
    player = TriviaRepository.get_player_by_name(username)

    if player is None or not TriviaRepository.check_hash(player['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401
    
    identity = {
        "id": player['id'],
        "name": player['name'],
        "email": player["email"],
    }

    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

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
        return jsonify({"msg": "Missing email parameter"}), 40

    hashed_password = TriviaRepository.generate_hash(password)

    if TriviaRepository.get_player_by_name(username) is not None:
        return jsonify({"msg": "Username already exists"}), 400

    player_id = TriviaRepository.create_player(username, email, hashed_password)
    
    identity = {
        "id": player_id,
        "name": username,
        "email": email
    }

    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({"msg": "User created successfully", "access_token":access_token, "refresh_token":refresh_token}), 201

@auth_routes.route('/google', methods=['POST'])
def google_callback():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    id_token_from_client = request.json.get('token', None)
    
    if not id_token_from_client:
        return jsonify({"msg": "Missing id_token parameter"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_from_client,
            google_requests.Request(),
            os.getenv('GOOGLE_CLIENT_ID')
        )

        user_id = idinfo['sub']
        user_email = idinfo['email']
        user_name = idinfo.get('name', "No Name")

        user = TriviaRepository.get_player_by_email(user_email)
        
        if user is None:
            user_id = TriviaRepository.create_player(user_name, user_email, 'google')
        else:
            user_id = user['id']

        identity = {
            "id": user_id,
            "name": user_name,
            "email": user_email
        }

        print(identity)

        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)

        return jsonify(access_token=access_token, refresh_token=refresh_token), 200

    except ValueError:
        # Invalid token
        return jsonify({"msg": "Invalid token"}), 400


@auth_routes.route('/check', methods=['GET'])
def check():
    verify_jwt_in_request()
    user_id = get_jwt_identity().id
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
