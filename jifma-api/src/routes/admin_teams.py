from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User
from models.teams import Team
from models.sports import Sport

admin_teams_bp = Blueprint('admin_teams', __name__)

def require_admin():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return False
    return True

# ROTAS PARA EQUIPES
@admin_teams_bp.route('/admin/teams', methods=['POST'])
@jwt_required()
def create_team():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        data = request.get_json()
        name = data.get('name')
        logo_url = data.get('logo_url')
        city = data.get('city')
        
        if not name:
            return jsonify({'error': 'Nome da equipe é obrigatório'}), 400
        
        # Verificar se equipe já existe
        if Team.query.filter_by(name=name).first():
            return jsonify({'error': 'Equipe com este nome já existe'}), 400
        
        team = Team(
            name=name,
            logo_url=logo_url,
            city=city
        )
        
        db.session.add(team)
        db.session.commit()
        
        return jsonify({
            'message': 'Equipe criada com sucesso',
            'team': team.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_teams_bp.route('/admin/teams/<team_id>', methods=['PUT'])
@jwt_required()
def update_team(team_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            # Verificar se outro time já tem esse nome
            existing_team = Team.query.filter_by(name=data['name']).first()
            if existing_team and existing_team.team_id != team_id:
                return jsonify({'error': 'Equipe com este nome já existe'}), 400
            team.name = data['name']
        
        if 'logo_url' in data:
            team.logo_url = data['logo_url']
        
        if 'city' in data:
            team.city = data['city']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Equipe atualizada com sucesso',
            'team': team.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_teams_bp.route('/admin/teams/<team_id>', methods=['DELETE'])
@jwt_required()
def delete_team(team_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada'}), 404
        
        db.session.delete(team)
        db.session.commit()
        
        return jsonify({'message': 'Equipe excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ROTAS PARA MODALIDADES
@admin_teams_bp.route('/admin/sports', methods=['POST'])
@jwt_required()
def create_sport():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        
        if not name:
            return jsonify({'error': 'Nome da modalidade é obrigatório'}), 400
        
        # Verificar se modalidade já existe
        if Sport.query.filter_by(name=name).first():
            return jsonify({'error': 'Modalidade com este nome já existe'}), 400
        
        sport = Sport(
            name=name,
            description=description
        )
        
        db.session.add(sport)
        db.session.commit()
        
        return jsonify({
            'message': 'Modalidade criada com sucesso',
            'sport': sport.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_teams_bp.route('/admin/sports/<sport_id>', methods=['PUT'])
@jwt_required()
def update_sport(sport_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        sport = Sport.query.get(sport_id)
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            # Verificar se outra modalidade já tem esse nome
            existing_sport = Sport.query.filter_by(name=data['name']).first()
            if existing_sport and existing_sport.sport_id != sport_id:
                return jsonify({'error': 'Modalidade com este nome já existe'}), 400
            sport.name = data['name']
        
        if 'description' in data:
            sport.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Modalidade atualizada com sucesso',
            'sport': sport.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_teams_bp.route('/admin/sports/<sport_id>', methods=['DELETE'])
@jwt_required()
def delete_sport(sport_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        sport = Sport.query.get(sport_id)
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        
        db.session.delete(sport)
        db.session.commit()
        
        return jsonify({'message': 'Modalidade excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

