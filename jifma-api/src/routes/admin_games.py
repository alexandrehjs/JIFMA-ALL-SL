from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User
from models.games import Game
from models.teams import Team
from models.sports import Sport
from datetime import datetime

admin_games_bp = Blueprint('admin_games', __name__)

def require_admin():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return False
    return True

@admin_games_bp.route('/admin/games', methods=['POST'])
@jwt_required()
def create_game():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        data = request.get_json()
        sport_id = data.get('sport_id')
        team_a_id = data.get('team_a_id')
        team_b_id = data.get('team_b_id')
        game_date = data.get('game_date')
        location = data.get('location')
        
        if not all([sport_id, team_a_id, team_b_id, game_date, location]):
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        # Verificar se modalidade e equipes existem
        sport = Sport.query.get(sport_id)
        team_a = Team.query.get(team_a_id)
        team_b = Team.query.get(team_b_id)
        
        if not sport:
            return jsonify({'error': 'Modalidade não encontrada'}), 404
        if not team_a:
            return jsonify({'error': 'Equipe A não encontrada'}), 404
        if not team_b:
            return jsonify({'error': 'Equipe B não encontrada'}), 404
        
        # Converter string de data para datetime
        try:
            game_datetime = datetime.fromisoformat(game_date.replace('Z', '+00:00'))
        except:
            return jsonify({'error': 'Formato de data inválido. Use ISO format.'}), 400
        
        game = Game(
            sport_id=sport_id,
            team_a_id=team_a_id,
            team_b_id=team_b_id,
            game_date=game_datetime,
            location=location,
            status='Agendado'
        )
        
        db.session.add(game)
        db.session.commit()
        
        return jsonify({
            'message': 'Jogo criado com sucesso',
            'game': game.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_games_bp.route('/admin/games/<game_id>', methods=['PUT'])
@jwt_required()
def update_game(game_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        data = request.get_json()
        
        if 'sport_id' in data:
            sport = Sport.query.get(data['sport_id'])
            if not sport:
                return jsonify({'error': 'Modalidade não encontrada'}), 404
            game.sport_id = data['sport_id']
        
        if 'team_a_id' in data:
            team_a = Team.query.get(data['team_a_id'])
            if not team_a:
                return jsonify({'error': 'Equipe A não encontrada'}), 404
            game.team_a_id = data['team_a_id']
        
        if 'team_b_id' in data:
            team_b = Team.query.get(data['team_b_id'])
            if not team_b:
                return jsonify({'error': 'Equipe B não encontrada'}), 404
            game.team_b_id = data['team_b_id']
        
        if 'game_date' in data:
            try:
                game.game_date = datetime.fromisoformat(data['game_date'].replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'Formato de data inválido'}), 400
        
        if 'location' in data:
            game.location = data['location']
        
        if 'status' in data:
            game.status = data['status']
        
        if 'score_a' in data:
            game.score_a = str(data['score_a'])

        if 'score_b' in data:
            game.score_b = str(data['score_b'])
        
        # Determinar vencedor se ambos os placares estão definidos
        if game.score_a is not None and game.score_b is not None:
            if game.score_a > game.score_b:
                game.winner_team_id = game.team_a_id
            elif game.score_b > game.score_a:
                game.winner_team_id = game.team_b_id
            else:
                game.winner_team_id = None  # Empate
        
        db.session.commit()
        
        return jsonify({
            'message': 'Jogo atualizado com sucesso',
            'game': game.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_games_bp.route('/admin/games/<game_id>', methods=['DELETE'])
@jwt_required()
def delete_game(game_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        db.session.delete(game)
        db.session.commit()
        
        return jsonify({'message': 'Jogo excluído com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_games_bp.route('/admin/games', methods=['GET'])
@jwt_required()
def get_all_games_admin():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        games = Game.query.order_by(Game.game_date.desc()).all()
        return jsonify([game.to_dict() for game in games]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

