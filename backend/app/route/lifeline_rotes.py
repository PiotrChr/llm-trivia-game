from flask import Blueprint, request, jsonify, session
from app.repository.TriviaRepository import TriviaRepository

lifeline_routes = Blueprint('lifeline_routes', __name__, url_prefix='/api/lifelines')

@lifeline_routes.route('/types', methods=['GET'])
def get_lifeline_types():
    try:
        lifeline_types = TriviaRepository.get_lifeline_types()
        return jsonify(lifeline_types), 200
    except:
        return jsonify({"msg": "Error getting lifeline types"}), 500
    
    