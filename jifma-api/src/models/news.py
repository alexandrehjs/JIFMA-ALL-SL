from models.user import db
from datetime import datetime
import uuid

class News(db.Model):
    __tablename__ = 'news'
    
    news_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    publication_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    image_url = db.Column(db.String(500), nullable=True)
    tags = db.Column(db.String(500), nullable=True)  # JSON string for tags array
    
    def to_dict(self):
        return {
            'news_id': self.news_id,
            'title': self.title,
            'content': self.content,
            'author': self.author,
            'publication_date': self.publication_date.isoformat(),
            'image_url': self.image_url,
            'tags': self.tags.split(',') if self.tags else []
        }

