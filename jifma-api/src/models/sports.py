from models.user import db
import uuid

class Sport(db.Model):
    __tablename__ = 'sports'
    
    sport_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    type = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'sport_id': self.sport_id,
            'name': self.name,
            'description': self.description,
            'type': self.type
        }

