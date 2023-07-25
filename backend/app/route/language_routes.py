import json
from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository

language_routes = Blueprint('langauge_routes', __name__)

@language_routes.route('/', methods=['GET'])
def get_languages():
    languages = TriviaRepository.get_languages()
    return jsonify(languages), 200