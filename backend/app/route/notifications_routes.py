from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.repository.TriviaRepository import TriviaRepository
from app.models.User import User

notifications_routes = Blueprint('notifications_routes', __name__, url_prefix='/api/notifications')

@notifications_routes.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    player_id = get_jwt_identity()['id']
    notifications = TriviaRepository.get_notifications(player_id)
    return jsonify(notifications=notifications)

@notifications_routes.route('/<int:notification_id>/mark_as_read', methods=['POST'])
@jwt_required()
def mark_notification_as_read(notification_id):
    player_id = get_jwt_identity()['id']
    TriviaRepository.mark_notification_as_read(notification_id, player_id)
    return jsonify(success=True)

@notifications_routes.route('/mark_all_as_read', methods=['POST'])
@jwt_required()
def mark_all_as_read():
    player_id = get_jwt_identity()['id']
    TriviaRepository.mark_all_notifications_as_read(player_id)
    return jsonify(success=True)