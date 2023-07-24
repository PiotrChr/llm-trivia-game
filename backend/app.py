from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager

from app.repository.TriviaRepository import TriviaRepository
from app.models.User import User
from app.route.player_routes import player_routes
from app.route.game_routes import game_routes
from app.route.question_routes import question_routes
from app.route.auth_routes import auth_routes
from utils.Database import Database


load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['SESSION_COOKIE_SECURE'] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers']  # Where to look for the JWT
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # Access token expires after one day
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # Refresh token expires after thirty days

jwt = JWTManager(app)  # Initialize the JWT manager
CORS(app, supports_credentials=True)


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

    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )