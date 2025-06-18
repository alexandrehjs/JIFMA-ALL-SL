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