from flask import current_app

from app.repository.TriviaRepository import TriviaRepository

FRIEND_REQUST = 'Friend Request'
GAME_INVITE = 'Player Invited'

class Notifications:

    @staticmethod
    def get_notifications(player_id):
        notifications = TriviaRepository.get_notifications(player_id)
        return notifications

    @staticmethod
    def mark_notification_as_read(notification_id, player_id):
        TriviaRepository.mark_notification_as_read(notification_id, player_id)
        return True
    
    @staticmethod
    def create_info_notification(player_id, message):
        notification_id = TriviaRepository.get_notification_type_by_name('Info')['id']

        id = TriviaRepository.create_notification(player_id, notification_id, message)
        notification = TriviaRepository.get_notification_by_id(id)

        Notifications.socket_notify(player_id, {
            'notification': notification,
        })
        
        return True
    
    @staticmethod
    def create_game_invite_notification(player_id):
        notification_id = TriviaRepository.get_notification_type_by_name(GAME_INVITE)['id']

        TriviaRepository.create_notification(player_id, notification_id, '')

        Notifications.socket_notify(player_id, {
            'message': 'You have been invited to a game',
            'type': GAME_INVITE,
        })
        return True
    
    @staticmethod
    def create_invite_notification(player_id):
        notification_id = TriviaRepository.get_notification_type_by_name(FRIEND_REQUST)['id']

        notification = TriviaRepository.create_notification(player_id, notification_id, '')

        Notifications.socket_notify(player_id, {
            'message': 'You have been invited to be friends',
            'type': FRIEND_REQUST,
            'notification': notification,
            'player_id': player_id
        })
        return True

    @staticmethod
    def socket_notify(player_id, message):
        socketio = current_app.extensions['socketio']

        socketio.emit('newNotification', message, to=f"player_{player_id}")
        return True
    
    