from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager

from backend.app.repository.TriviaRepository import TriviaRepository
from backend.app.models.User import User
from backend.app.route.player_routes import player_routes
from backend.app.route.game_routes import game_routes
from backend.app.route.question_routes import question_routes
from backend.app.route.auth_routes import auth_routes
from backend.app.route.question_routes import question_routes

app = Flask(__name__)
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    trivia_repository = TriviaRepository()
    player = trivia_repository.get_player_by_id(user_id)
    if player is not None:
        return User(player['id'], player['name'])
    return None

app.register_blueprint(player_routes, url_prefix='/api')
app.register_blueprint(game_routes, url_prefix='/api')
app.register_blueprint(question_routes, url_prefix='/api')
app.register_blueprint(auth_routes, url_prefix='/api')
app.register_blueprint(question_routes, url_prefix='/api')
