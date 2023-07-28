from flask_socketio import send, emit, leave_room, join_room
import time

from app.repository.TriviaRepository import TriviaRepository
from app.service.QuestionManager import QuestionManager


def register_handlers(socketio):

    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')
        emit('ping', broadcast=True)

    @socketio.on('ready')
    def handle_ready(data):
        print(f'Player {data["player"]["id"]} is ready')
        emit('is_ready', data, broadcast=True, room=data['game_id'])

    @socketio.on('check_answers')
    def handle_check_answers(data):
        player_answers = TriviaRepository.get_player_answers(data['game_id'], data['player_id'])

        emit('answers_checked', {"player_answers": player_answers}, broadcast=True, room=data['game_id'])

    @socketio.on('answer')
    def handle_answer(data):
        TriviaRepository.answer_question(data['game_id'], data['player']['id'], data['answer_id'])

        emit('answered', data, broadcast=True, room=data['game_id'])

    @socketio.on('join')
    def on_join(data):
        room = data['game_id']
        join_room(room)
        emit('joined', {"player": data['player'], "game_id": data["game_id"]}, room=room, broadcast=True)

    @socketio.on('leave')
    def on_leave(data):
        room = data['game_id']
        leave_room(room)
        emit('left', {"player": data['player'], "game_id": data['game_id']}, room=room, broadcast=True)

    @socketio.on('start')
    def handle_start(data):
        room = data['game_id']
    
        # Check if the player is the host
        game = TriviaRepository.get_game_by_id(data['game_id'])
        if game['host'] != data['player']['id']:
            return
                
        countdown = 10
        for i in range(countdown, -1, -1):
            # Send a message with the remaining time
            emit('countdown', {'remaining_time': i}, room=room, broadcast=True)
            socketio.sleep(1)
        
        TriviaRepository.start_game(data['game_id'])

        emit('started', {"player": data['player'], "game_id": data['game_id']}, room=room, broadcast=True)

    @socketio.on('next')
    def handle_next_question(data):
        room = data['game_id']
        game = TriviaRepository.get_game_by_id(data['game_id'])
        if game['host'] != data['player']['id']:
            return

        emit('drawing', {"game_id": data['game_id']}, room=room, broadcast=True)
        socketio.sleep(1)

        question = QuestionManager.next_question(
            data['game_id'],
            data['category'],
            data['difficulty']
        )

        print('done drawing')
        emit('drawn', {"game_id": data['game_id']}, room=room, broadcast=True)

        countdown = 3
        for i in range(countdown, -1, -1):
            # Send a message with the remaining time
            emit('countdown', {'remaining_time': i}, room=room, broadcast=True)
            socketio.sleep(1)

        print('Question is ready')
        emit(
            'question_ready',
            {"player": data['player'], "game_id": data['game_id'], "next_question": question},
            room=room,
            broadcast=True
        )

    @socketio.on('ping')
    def handle_ping(data):
        emit('ping', broadcast=True, room=data['game_id'])

    @socketio.on('pong')
    def handle_pong(data):
        emit('pong', data, broadcast=True, room=data['game_id'])


    @socketio.on('*')
    def catch_all(event, data):
        print(f'Event: {event}, Data: {data}')