import json
from flask import Blueprint, request, jsonify
from app.repository.TriviaRepository import TriviaRepository
from flask_jwt_extended import jwt_required, get_jwt_identity

category_routes = Blueprint('category_routes', __name__)

@category_routes.route('/', methods=['GET'])
def get_categories():
    categories = TriviaRepository.get_categories()
    return jsonify(categories), 200

@category_routes.route('/submit', methods=['GET'])
@jwt_required()
def submit_category():
    try:
        categoryName = request.json.get('categoryName', None)
        language = request.json.get('language', None)

        player_id = get_jwt_identity()['id']

        TriviaRepository.submit_category(
            categoryName,
            language,
            player_id
        )
        return jsonify({"msg": "Category submitted"}), 200
    except Exception as error:
        print('Error in submit_category:', error)
        return jsonify({"msg": "Error submitting category"}), 500
