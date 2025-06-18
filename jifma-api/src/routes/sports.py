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

@sports_bp.route('/sports', methods=['POST'])
def create_sport():
    """Cria uma nova modalidade esportiva"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Nome da modalidade é obrigatório'}), 400
        
        # Verifica se já existe uma modalidade com esse nome
        existing_sport = Sport.query.filter_by(name=data['name']).first()
        if existing_sport:
            return jsonify({'error': 'Modalidade já existe'}), 400
        
        sport = Sport(
            name=data['name'],
            description=data.get('description')
        )
        
        db.session.add(sport)
        db.session.commit()
        
        return jsonify(sport.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sports_bp.route('/sports/<sport_id>', methods=['PUT'])
def update_sport(sport_id):
    """Atualiza uma modalidade existente"""
    try:
        sport = Sport.query.get(sport_id)
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        
        data = request.get_json()
        
        if data.get('name'):
            # Verifica se já existe outra modalidade com esse nome
            existing_sport = Sport.query.filter_by(name=data['name']).first()
            if existing_sport and existing_sport.sport_id != sport_id:
                return jsonify({'error': 'Modalidade com esse nome já existe'}), 400
            sport.name = data['name']
        
        if data.get('description') is not None:
            sport.description = data['description']
        
        db.session.commit()
        
        return jsonify(sport.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sports_bp.route('/sports/<sport_id>', methods=['DELETE'])
def delete_sport(sport_id):
    """Deleta uma modalidade"""
    try:
        sport = Sport.query.get(sport_id)
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        
        db.session.delete(sport)
        db.session.commit()
        
        return jsonify({'message': 'Modalidade deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

