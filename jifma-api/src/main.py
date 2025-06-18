import os
import sys
# DON'T CHANGE THIS LINE
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models.user import db, User
from models.news import News
from models.sports import Sport
from models.teams import Team
from models.games import Game
from models.medals import MedalStanding

# Import blueprints
from routes.admin_users import user_bp
from routes.news import news_bp
from routes.sports import sports_bp
from routes.teams import teams_bp
from routes.games import games_bp
from routes.medals import medals_bp
from routes.auth import auth_bp
from routes.admin_news import admin_news_bp
from routes.admin_games import admin_games_bp
from routes.admin_teams import admin_teams_bp

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///jifma.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins="*")
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(news_bp, url_prefix='/api')
    app.register_blueprint(sports_bp, url_prefix='/api')
    app.register_blueprint(teams_bp, url_prefix='/api')
    app.register_blueprint(games_bp, url_prefix='/api')
    app.register_blueprint(medals_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(admin_news_bp, url_prefix='/api')
    app.register_blueprint(admin_games_bp, url_prefix='/api')
    app.register_blueprint(admin_teams_bp, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()
        
        # Initialize default data if tables are empty
        if Sport.query.count() == 0:
            sports = [
                Sport(name='Futsal', description='Modalidade de futebol indoor'),
                Sport(name='Futebol de Campo', description='Futebol tradicional em campo aberto'),
                Sport(name='Vôlei de Praia', description='Voleibol na areia'),
                Sport(name='Vôlei de Quadra', description='Voleibol em quadra coberta'),
                Sport(name='Handebol', description='Esporte coletivo com as mãos'),
                Sport(name='Basquete', description='Basquetebol em quadra')
            ]
            for sport in sports:
                db.session.add(sport)
            
            teams = [
                Team(name='Informática', city='Caxias'),
                Team(name='Administração', city='Caxias'),
                Team(name='Agropecuária', city='Caxias'),
                Team(name='Edificações', city='Caxias')
            ]
            for team in teams:
                db.session.add(team)
            
            # Criar usuário administrador padrão
            admin_user = User(
                username='admin',
                email='admin@jifma.com',
                is_admin=True
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            
            db.session.commit()
    
    @app.route('/')
    def index():
        return {
            'message': 'JIFMA API - Portal dos Jogos Internos do IFMA Campus Caxias',
            'version': '2.0.0',
            'endpoints': {
                'public': {
                    'news': '/api/news',
                    'sports': '/api/sports',
                    'teams': '/api/teams',
                    'games': '/api/games',
                    'medals': '/api/medals'
                },
                'auth': {
                    'login': '/api/login',
                    'register': '/api/register',
                    'profile': '/api/profile',
                    'verify_admin': '/api/verify-admin'
                },
                'admin': {
                    'news': '/api/admin/news',
                    'games': '/api/admin/games',
                    'teams': '/api/admin/teams',
                    'sports': '/api/admin/sports'
                }
            }
        }
    
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'message': 'API is running'}
    
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=True)

