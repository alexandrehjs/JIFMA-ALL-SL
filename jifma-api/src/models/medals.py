from models.user import db
import uuid

class MedalStanding(db.Model):
    __tablename__ = 'medal_standings'
    
    medal_standing_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id = db.Column(db.String(36), db.ForeignKey('teams.team_id'), nullable=False)
    gold_medals = db.Column(db.Integer, nullable=False, default=0)
    silver_medals = db.Column(db.Integer, nullable=False, default=0)
    bronze_medals = db.Column(db.Integer, nullable=False, default=0)
    
    @property
    def total_medals(self):
        return self.gold_medals + self.silver_medals + self.bronze_medals
    
    def to_dict(self):
        return {
            'medal_standing_id': self.medal_standing_id,
            'team_id': self.team_id,
            'gold_medals': self.gold_medals,
            'silver_medals': self.silver_medals,
            'bronze_medals': self.bronze_medals,
            'total_medals': self.total_medals
        }

