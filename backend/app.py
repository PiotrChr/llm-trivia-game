from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from dotenv import load_dotenv
import os

from app.repository.TriviaRepository import TriviaRepository
from app.models.User import User
from app.route.player_routes import player_routes
from app.route.game_routes import game_routes
from app.route.question_routes import question_routes
from app.route.auth_routes import auth_routes
from utils.Database import Database


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['SESSION_COOKIE_SECURE'] = False
CORS(app, supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    print(f"Loading user with id: {user_id}")
    trivia_repository = TriviaRepository()
    player = trivia_repository.get_player_by_id(user_id)
    if player is not None:
        return User(player['id'], player['name'])
    return None

@app.teardown_appcontext
def close_db(e=None):
    Database.close()

app.register_blueprint(player_routes, url_prefix='/api/players')
app.register_blueprint(game_routes, url_prefix='/api/games')
app.register_blueprint(question_routes, url_prefix='/api/questions')
app.register_blueprint(auth_routes, url_prefix='/api/auth')

port = os.getenv('BACKEND_PORT', 9000)

if __name__ == '__main__':
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Route: {rule.rule}")

    app.run(host='0.0.0.0', port=port, debug=True)