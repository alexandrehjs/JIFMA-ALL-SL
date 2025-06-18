from flask import Blueprint, request, jsonify
from models.user import db
from models.games import Game
from models.teams import Team
from models.sports import Sport
from datetime import datetime
from sqlalchemy.orm import aliased

games_bp = Blueprint('games', __name__)

@games_bp.route('/games', methods=['GET'])
def get_all_games():
    """Retorna todos os jogos com informações das equipes e modalidades"""
    try:
        TeamA = aliased(Team, name='team_a')
        TeamB = aliased(Team, name='team_b')

    # Build the query using the aliases
        games = db.session.query(
            Game,
            TeamA.name.label('team_a_name'),
            TeamB.name.label('team_b_name'),
            Sport.name.label('sport_name')
        ).join(
            TeamA, Game.team_a_id == TeamA.team_id  # Join with the first alias
        ).join(
            TeamB, Game.team_b_id == TeamB.team_id  # Join with the second alias
        ).join(
            Sport, Game.sport_id == Sport.sport_id
        ).order_by(
            Game.game_date.asc()
        ).all()
        
        result = []
        for game, team_a_name, team_b_name, sport_name in games:
            game_dict = game.to_dict()
            game_dict['team_a_name'] = team_a_name
            game_dict['team_b_name'] = team_b_name
            game_dict['sport_name'] = sport_name
            result.append(game_dict)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@games_bp.route('/games/<game_id>', methods=['GET'])
def get_game_by_id(game_id):
    """Retorna um jogo específico pelo ID"""
    try:
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        return jsonify(game.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@games_bp.route('/games/sport/<sport_id>', methods=['GET'])
def get_games_by_sport(sport_id):
    """Retorna todos os jogos de uma modalidade específica"""
    try:
        games = Game.query.filter_by(sport_id=sport_id).order_by(Game.game_date.asc()).all()
        return jsonify([game.to_dict() for game in games]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500