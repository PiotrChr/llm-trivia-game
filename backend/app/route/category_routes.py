import json
from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository

category_routes = Blueprint('category_routes', __name__)

@category_routes.route('/', methods=['GET'])
def get_categories():
    categories = TriviaRepository.get_categories()
    return jsonify(categories), 200