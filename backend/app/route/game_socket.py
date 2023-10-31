from flask_socketio import emit, leave_room, join_room
from flask import request
import time
from flask_jwt_extended import JWTManager, decode_token
from app.repository.TriviaRepository import TriviaRepository
from app.service.QuestionManager import QuestionManager


def register_handlers(socketio):
    @socketio.on('connect')
    def handle_connect(data):
        token = request.args.get('token')
        
        if not token:
            raise ConnectionRefusedError('Authentication token is missing')

        try:
            decoded_token = decode_token(token)
        except Exception as e:
            raise ConnectionRefusedError(f'Invalid token: {str(e)}')
        
        player_id = decoded_token['sub']['id']
        player = TriviaRepository.get_player_by_id(player_id)
        
        if not player:
            raise ConnectionRefusedError('Player not found')
        
        join_room('player_%s' % player_id)
    
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

    @socketio.on('miss')
    def miss_answer(data):
        TriviaRepository.miss_answer(
            data['game_id'],
            data['question_id'],
            data['player']['id']
        )

        emit('answer_missed', data, broadcast=True, room=data['game_id'])

    @socketio.on('answer')
    def handle_answer(data):
        game = TriviaRepository.get_game_by_id(data['game_id'])

        TriviaRepository.answer_question(
            data['game_id'],
            data['question_id'],
            data['player']['id'],
            data['answer_id'],
            data['time']
        )

        answer = TriviaRepository.get_answer_by_id(data['answer_id'])

        if answer['is_correct']:
            TriviaRepository.add_points(data['player']['id'], game['mode_id'], 1)

        emit('answered', data, broadcast=True, room=data['game_id'])

    @socketio.on('join_private')
    def handle_join_private(data):
        room = 'player_%s' % data['player']['id']
        join_room(room)

    @socketio.on('join')
    def on_join(data):
        room = data['game_id']
        join_room(room)

        player_points = TriviaRepository.get_player_points_by_game(data['game_id'], data['player']['id'])

        print('Player joined', data['player']['id'], player_points)

        emit('joined', {"player": data['player'], "game_id": data["game_id"], "player_points": player_points}, room=room, broadcast=True)

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
                
        countdown = 5
        for i in range(countdown, -1, -1):
            # Send a message with the remaining time
            emit('countdown', {'remaining_time': i, 'total_time': countdown }, room=room, broadcast=True)
            socketio.sleep(1)
        
        TriviaRepository.start_game(data['game_id'])

        emit('started', {"player": data['player'], "game_id": data['game_id']}, room=room, broadcast=True)

    @socketio.on('end_game')
    def handle_end_game(data):
        room = data['game_id']
        game = TriviaRepository.get_game_by_id(data['game_id'])
        if game['host'] != data['player']['id']:
            return

        TriviaRepository.end_game(data['game_id'])

        emit('game_over', {"game_id": data['game_id']}, room=room, broadcast=True)

    @socketio.on('next')
    def handle_next_question(data):
        room = data['game_id']
        game = TriviaRepository.get_game_by_id(data['game_id'])
        if game['host'] != data['player']['id']:
            return
        
        if game['max_questions'] > 0 and game['questions_answered'] >= game['max_questions']:
            TriviaRepository.end_game(data['game_id'])

            emit('game_over', {"game_id": data['game_id']}, room=room, broadcast=True)
            return

        emit('drawing', {"game_id": data['game_id']}, room=room, broadcast=True)
        socketio.sleep(1)

        print('drawing', data['game_id'], data['category'], data['difficulty'], data['language'])

        try:
            question = QuestionManager.next_question(
                data['game_id'],
                data['category'],
                data['difficulty'],
                data['language']
            )
        except Exception as e:
            print(e)
            emit('error', {"msg": "No questions found", "context": "next"}, room=room, broadcast=True)
            return

        print('done drawing')
        emit('drawn', {"game_id": data['game_id']}, room=room, broadcast=True)

        countdown = 3
        for i in range(countdown, -1, -1):
            # Send a message with the remaining time
            emit('countdown', {'remaining_time': i, 'total_time': countdown }, room=room, broadcast=True)
            socketio.sleep(1)

        print('Question is ready')
        emit(
            'question_ready',
            {"player": data['player'], "game_id": data['game_id'], "next_question": question},
            room=room,
            broadcast=True
        )

        print('time_limit', game['time_limit'])

        if int(game['time_limit']) > 0:
            emit('start_timer', {"game_id": data['game_id'], "time_limit": game['time_limit']}, room=room, broadcast=True)

    @socketio.on('pingx')
    def handle_ping(data):
        emit('pingx', broadcast=True, room=data['game_id'])

    @socketio.on('pongx')
    def handle_pong(data):
        player_points = TriviaRepository.get_player_points_by_game(data['game_id'], data['player']['id'])

        emit('pongx', { **data, "player_points": player_points }, broadcast=True, room=data['game_id'])

    @socketio.on('message')
    def handle_message(data):
        emit('message', data, broadcast=True, room=data['game_id'])

    @socketio.on('get_winners')
    def handle_get_winners(data):
        winners = TriviaRepository.get_round_winners(data['game_id'], data['question_id'])
        print(winners)
        emit('winners', {"winners": winners}, broadcast=True, room=data['game_id'])

    @socketio.on('difficulty_changed')
    def handle_difficulty_change(data):
        emit('difficulty_changed', data, broadcast=True, room=data['game_id'])

    @socketio.on('category_changed')
    def handle_category_change(data):
        if 'new_category' in data:
            cat_id = TriviaRepository.create_category(data['new_category'])
            cat_name = data['new_category']
        else:
            cat_id = data['category']['id']
            cat_name = data['category']['name']
            
        TriviaRepository.set_current_category(data['game_id'], cat_id)
        
        emit('category_changed', {
            "category": {
                "id": cat_id,
                "name": cat_name
            }
        }, broadcast=True, room=data['game_id'])

    @socketio.on('language_changed')
    def handle_language_change(data):
        TriviaRepository.set_game_language(data['game_id'], data['language'])
        emit('language_changed', data, broadcast=True, room=data['game_id'])

    @socketio.on('*')
    def catch_all(event, data):
        print(f'Event: {event}, Data: {data}')