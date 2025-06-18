from flask import Blueprint, request, jsonify
from models.user import db
from models.sports import Sport

sports_bp = Blueprint('sports', __name__)

@sports_bp.route('/sports', methods=['GET'])
def get_all_sports():
    """Retorna todas as modalidades esportivas"""
    try:
        sports = Sport.query.all()
        return jsonify([sport.to_dict() for sport in sports]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sports_bp.route('/sports/<sport_id>', methods=['GET'])
def get_sport_by_id(sport_id):
    """Retorna uma modalidade específica pelo ID"""
    try:
        sport = Sport.query.get(sport_id)
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        return jsonify(sport.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

