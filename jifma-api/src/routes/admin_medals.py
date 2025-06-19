from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity # Import JWT functions
from models.user import db, User # Import User model to use require_admin
from models.medals import MedalStanding
from models.teams import Team

medals_bp = Blueprint('admin_medals', __name__)

def require_admin():
    """
    Helper function to check if the current authenticated user is an admin.
    (Duplicated for clarity in this specific blueprint, but in a larger app,
    you might centralize this or import it from a common utility file.)
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return False
    return True

@medals_bp.route('/medals', methods=['GET'])
def get_medal_standings():
    """Retorna o quadro de medalhas ordenado por ouro, prata e bronze"""
    try:
        standings = db.session.query(MedalStanding, Team.name.label('team_name')) \
            .join(Team, MedalStanding.team_id == Team.team_id) \
            .order_by(MedalStanding.gold_medals.desc(),
                      MedalStanding.silver_medals.desc(),
                      MedalStanding.bronze_medals.desc()).all()

        result = []
        for standing, team_name in standings:
            standing_dict = standing.to_dict()
            standing_dict['team_name'] = team_name
            result.append(standing_dict)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@medals_bp.route('/admin/medals/<team_id>', methods=['GET'])
def get_team_medals(team_id):
    """Retorna as medalhas de uma equipe específica"""
    try:
        standing = MedalStanding.query.filter_by(team_id=team_id).first()
        if not standing:
            return jsonify({'error': 'Quadro de medalhas não encontrado para esta equipe'}), 404
        return jsonify(standing.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@medals_bp.route('/admin/medals', methods=['POST'])
@jwt_required()
def create_medal_standing():
    """Cria um novo registro no quadro de medalhas"""
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        data = request.get_json()

        if not data or not data.get('team_id'):
            return jsonify({'error': 'ID da equipe é obrigatório'}), 400

        existing_standing = MedalStanding.query.filter_by(team_id=data['team_id']).first()
        if existing_standing:
            return jsonify({'error': 'Quadro de medalhas já existe para esta equipe'}), 400

        standing = MedalStanding(
            team_id=data['team_id'],
            gold_medals=data.get('gold_medals', 0),
            silver_medals=data.get('silver_medals', 0),
            bronze_medals=data.get('bronze_medals', 0)
        )

        db.session.add(standing)
        db.session.commit()

        return jsonify(standing.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@medals_bp.route('/admin/medals/<team_id>', methods=['PUT'])
@jwt_required()
def update_medal_standing(team_id):
    """Atualiza o quadro de medalhas de uma equipe"""
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        standing = MedalStanding.query.filter_by(team_id=team_id).first()
        if not standing:
            return jsonify({'error': 'Quadro de medalhas não encontrado para esta equipe'}), 404

        data = request.get_json()

        if 'gold_medals' in data and data['gold_medals'] is not None:
            standing.gold_medals = data['gold_medals']
        if 'silver_medals' in data and data['silver_medals'] is not None:
            standing.silver_medals = data['silver_medals']
        if 'bronze_medals' in data and data['bronze_medals'] is not None:
            standing.bronze_medals = data['bronze_medals']

        db.session.commit()

        return jsonify(standing.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@medals_bp.route('/admin/medals/<team_id>', methods=['DELETE'])
@jwt_required()
def delete_medal_standing(team_id):
    """Deleta o quadro de medalhas de uma equipe"""
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        standing = MedalStanding.query.filter_by(team_id=team_id).first()
        if not standing:
            return jsonify({'error': 'Quadro de medalhas não encontrado para esta equipe'}), 404

        db.session.delete(standing)
        db.session.commit()

        return jsonify({'message': 'Quadro de medalhas deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500