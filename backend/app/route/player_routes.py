from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.repository.TriviaRepository import TriviaRepository

player_routes = Blueprint('player_routes', __name__)

# @player_routes.route('/', methods=['POST'])
# def create_player():
#     data = request.get_json()
#     player_id = trivia_repository.create_player(data['name'])
#     return jsonify(player_id=player_id)


@player_routes.route('/', methods=['GET'])
def get_players():
    players = TriviaRepository.get_players()
    return jsonify(players=players)


@player_routes.route('/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = TriviaRepository.get_player_by_id(player_id)
    return jsonify(player=player)

@player_routes.route('/stats', methods=['GET'])
@jwt_required()
def get_player_stats():
    player_id = request.args.get('player_id')

    player_stats = TriviaRepository.get_player_stats(player_id)
    return jsonify(player_stats=player_stats)


@player_routes.route('/<int:player_id>/answers', methods=['GET'])
def get_player_answers(player_id):
    answers = TriviaRepository.get_player_answers(None,player_id)
    return jsonify(answers=answers)


@player_routes.route('/friends', methods=['GET'])
@jwt_required()
def get_player_friends():
    player_id = get_jwt_identity()['id']
    friends = TriviaRepository.get_player_friends(player_id) or []
    return jsonify(friends=friends)

@player_routes.route('/friends/invite', methods=['POST'])
@jwt_required()
def invite_friend():
    player_id = get_jwt_identity()['id']
    data = request.get_json()
    TriviaRepository.invite_friend(player_id, data['friend_id'])
    return jsonify(success=True)

@player_routes.route('/friends/search', methods=['GET'])
@jwt_required()
def search_player():
    player_id = get_jwt_identity()['id']
    search = request.args.get('search')
    players = TriviaRepository.search_player_by_string(search)
    return jsonify(players=players)

@player_routes.route('/friends/invitations', methods=['GET'])
@jwt_required()
def get_player_friend_invitations():
    player_id = get_jwt_identity()['id']
    friend_invitations = TriviaRepository.get_player_friend_invitations(player_id)
    return jsonify(friend_invitations=friend_invitations)

@player_routes.route('/friends/accept', methods=['POST'])
@jwt_required()
def accept_invite():
    player_id = get_jwt_identity()['id']
    data = request.get_json()
    TriviaRepository.accept_invite(player_id, data['friend_id'])
    return jsonify(success=True)

@player_routes.route('/friends/decline', methods=['POST'])
@jwt_required()
def decline_invite():
    player_id = get_jwt_identity()['id']
    data = request.get_json()
    TriviaRepository.decline_invite(player_id, data['friend_id'])
    return jsonify(success=True)