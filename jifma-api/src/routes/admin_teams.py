from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from models.sports import Sport
from models.user import db, User
from models.teams import Team
from models.games import Game 
import uuid

admin_teams_bp = Blueprint('admin_teams', __name__)

def require_admin():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.is_admin

def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

@admin_teams_bp.route('/admin/teams/<team_id>', methods=['DELETE'])
@jwt_required()
def delete_team(team_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        if not is_valid_uuid(team_id):
            return jsonify({'error': 'ID inválido.'}), 400

        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada.'}), 404

        # Verifica se há jogos vinculados a essa equipe
        jogos_vinculados = Game.query.filter(
            or_(
                Game.team_a_id == team_id,
                Game.team_b_id == team_id,
                Game.winner_team_id == team_id
            )
        ).first()

        if jogos_vinculados:
            return jsonify({'error': 'Não é possível excluir esta equipe pois existem jogos ou estatísticas vinculadas a ela.'}), 400

        db.session.delete(team)
        db.session.commit()

        return jsonify({'message': 'Equipe excluída com sucesso'}), 200

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
        type = data.get("type")
        
        if not name:
            return jsonify({'error': 'Nome da modalidade é obrigatório'}), 400
        
        # Verificar se modalidade já existe
        if Sport.query.filter_by(name=name).first():
            return jsonify({'error': 'Modalidade com este nome já existe'}), 400
        
        sport = Sport(
            name=name,
            description=description,
            type=type
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

        if 'type' in data:
            sport.type = data['type']
        
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

