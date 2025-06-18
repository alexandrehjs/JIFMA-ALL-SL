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

@games_bp.route('/games', methods=['POST'])
def create_game():
    """Cria um novo jogo"""
    try:
        data = request.get_json()
        
        required_fields = ['sport_id', 'team_a_id', 'team_b_id', 'game_date']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Modalidade, equipes e data do jogo são obrigatórios'}), 400
        
        # Verifica se as equipes são diferentes
        if data['team_a_id'] == data['team_b_id']:
            return jsonify({'error': 'As equipes devem ser diferentes'}), 400
        
        # Converte a data
        try:
            game_date = datetime.fromisoformat(data['game_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use ISO format'}), 400
        
        game = Game(
            sport_id=data['sport_id'],
            team_a_id=data['team_a_id'],
            team_b_id=data['team_b_id'],
            game_date=game_date,
            location=data.get('location'),
            status=data.get('status', 'Agendado')
        )
        
        db.session.add(game)
        db.session.commit()
        
        return jsonify(game.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@games_bp.route('/games/<game_id>', methods=['PUT'])
def update_game(game_id):
    """Atualiza um jogo existente"""
    try:
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        data = request.get_json()
        
        if data.get('sport_id'):
            game.sport_id = data['sport_id']
        if data.get('team_a_id'):
            game.team_a_id = data['team_a_id']
        if data.get('team_b_id'):
            game.team_b_id = data['team_b_id']
        if data.get('score_a') is not None:
            game.score_a = data['score_a']
        if data.get('score_b') is not None:
            game.score_b = data['score_b']
        if data.get('game_date'):
            try:
                game.game_date = datetime.fromisoformat(data['game_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Formato de data inválido'}), 400
        if data.get('location') is not None:
            game.location = data['location']
        if data.get('status'):
            game.status = data['status']
        if data.get('winner_team_id') is not None:
            game.winner_team_id = data['winner_team_id']
        
        # Verifica se as equipes são diferentes
        if game.team_a_id == game.team_b_id:
            return jsonify({'error': 'As equipes devem ser diferentes'}), 400
        
        db.session.commit()
        
        return jsonify(game.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@games_bp.route('/games/<game_id>', methods=['DELETE'])
def delete_game(game_id):
    """Deleta um jogo"""
    try:
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        db.session.delete(game)
        db.session.commit()
        
        return jsonify({'message': 'Jogo deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

