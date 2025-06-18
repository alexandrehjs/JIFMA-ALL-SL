from models.user import db
from datetime import datetime
import uuid

class Game(db.Model):
    __tablename__ = 'games'
    
    game_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sport_id = db.Column(db.String(36), db.ForeignKey('sports.sport_id'), nullable=False)
    team_a_id = db.Column(db.String(36), db.ForeignKey('teams.team_id'), nullable=False)
    team_b_id = db.Column(db.String(36), db.ForeignKey('teams.team_id'), nullable=False)
    score_a = db.Column(db.Integer, nullable=True)
    score_b = db.Column(db.Integer, nullable=True)
    game_date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Agendado')  # Agendado, Em Andamento, Finalizado, Cancelado
    winner_team_id = db.Column(db.String(36), db.ForeignKey('teams.team_id'), nullable=True)
    
    def to_dict(self):
        return {
            'game_id': self.game_id,
            'sport_id': self.sport_id,
            'team_a_id': self.team_a_id,
            'team_b_id': self.team_b_id,
            'score_a': self.score_a,
            'score_b': self.score_b,
            'game_date': self.game_date.isoformat(),
            'location': self.location,
            'status': self.status,
            'winner_team_id': self.winner_team_id
        }

