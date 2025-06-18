from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User
from models.news import News
from datetime import datetime

admin_news_bp = Blueprint('admin_news', __name__)

def require_admin():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return False
    return True

@admin_news_bp.route('/admin/news', methods=['POST'])
@jwt_required()
def create_news():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        author = data.get('author')
        image_url = data.get('image_url')
        
        if not title or not content or not author:
            return jsonify({'error': 'Título, conteúdo e autor são obrigatórios'}), 400
        
        news = News(
            title=title,
            content=content,
            author=author,
            image_url=image_url
        )
        
        db.session.add(news)
        db.session.commit()
        
        return jsonify({
            'message': 'Notícia criada com sucesso',
            'news': news.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_news_bp.route('/admin/news/<news_id>', methods=['PUT'])
@jwt_required()
def update_news(news_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        news = News.query.get(news_id)
        if not news:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            news.title = data['title']
        if 'content' in data:
            news.content = data['content']
        if 'author' in data:
            news.author = data['author']
        if 'image_url' in data:
            news.image_url = data['image_url']
        
        news.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Notícia atualizada com sucesso',
            'news': news.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_news_bp.route('/admin/news/<news_id>', methods=['DELETE'])
@jwt_required()
def delete_news(news_id):
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        news = News.query.get(news_id)
        if not news:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        
        db.session.delete(news)
        db.session.commit()
        
        return jsonify({'message': 'Notícia excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_news_bp.route('/admin/news', methods=['GET'])
@jwt_required()
def get_all_news_admin():
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
        
        news_list = News.query.order_by(News.created_at.desc()).all()
        return jsonify([news.to_dict() for news in news_list]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

