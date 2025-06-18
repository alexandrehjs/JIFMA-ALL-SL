from flask import Blueprint, request, jsonify
from models.user import db
from models.teams import Team

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/teams', methods=['GET'])
def get_all_teams():
    """Retorna todas as equipes"""
    try:
        teams = Team.query.all()
        return jsonify([team.to_dict() for team in teams]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/teams/<team_id>', methods=['GET'])
def get_team_by_id(team_id):
    """Retorna uma equipe específica pelo ID"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada'}), 404
        return jsonify(team.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/teams', methods=['POST'])
def create_team():
    """Cria uma nova equipe"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Nome da equipe é obrigatório'}), 400
        
        team = Team(
            name=data['name'],
            logo_url=data.get('logo_url'),
            city=data.get('city')
        )
        
        db.session.add(team)
        db.session.commit()
        
        return jsonify(team.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/teams/<team_id>', methods=['PUT'])
def update_team(team_id):
    """Atualiza uma equipe existente"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada'}), 404
        
        data = request.get_json()
        
        if data.get('name'):
            team.name = data['name']
        if data.get('logo_url') is not None:
            team.logo_url = data['logo_url']
        if data.get('city') is not None:
            team.city = data['city']
        
        db.session.commit()
        
        return jsonify(team.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/teams/<team_id>', methods=['DELETE'])
def delete_team(team_id):
    """Deleta uma equipe"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Equipe não encontrada'}), 404
        
        db.session.delete(team)
        db.session.commit()
        
        return jsonify({'message': 'Equipe deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

