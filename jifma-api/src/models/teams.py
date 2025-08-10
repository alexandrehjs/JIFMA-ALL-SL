from models.user import db
import uuid

class Team(db.Model):
    __tablename__ = 'teams'
    
    team_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    logo_url = db.Column(db.String(500), nullable=True)
    city = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            'team_id': self.team_id,
            'name': self.name,
            'logo_url': self.logo_url,
            'city': self.city
        }

# Função utilitária fora da classe
def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False
