from flask import Blueprint, request, jsonify
from models.user import db
from models.news import News
from datetime import datetime

news_bp = Blueprint('news', __name__)

@news_bp.route('/news', methods=['GET'])
def get_all_news():
    """Retorna todas as notícias"""
    try:
        news = News.query.order_by(News.publication_date.desc()).all()
        return jsonify([article.to_dict() for article in news]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<news_id>', methods=['GET'])
def get_news_by_id(news_id):
    """Retorna uma notícia específica pelo ID"""
    try:
        news = News.query.get(news_id)
        if not news:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        return jsonify(news.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news', methods=['POST'])
def create_news():
    """Cria uma nova notícia"""
    try:
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content') or not data.get('author'):
            return jsonify({'error': 'Título, conteúdo e autor são obrigatórios'}), 400
        
        tags_str = ','.join(data.get('tags', [])) if data.get('tags') else None
        
        news = News(
            title=data['title'],
            content=data['content'],
            author=data['author'],
            image_url=data.get('image_url'),
            tags=tags_str
        )
        
        db.session.add(news)
        db.session.commit()
        
        return jsonify(news.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<news_id>', methods=['PUT'])
def update_news(news_id):
    """Atualiza uma notícia existente"""
    try:
        news = News.query.get(news_id)
        if not news:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        
        data = request.get_json()
        
        if data.get('title'):
            news.title = data['title']
        if data.get('content'):
            news.content = data['content']
        if data.get('author'):
            news.author = data['author']
        if data.get('image_url') is not None:
            news.image_url = data['image_url']
        if data.get('tags') is not None:
            news.tags = ','.join(data['tags']) if data['tags'] else None
        
        db.session.commit()
        
        return jsonify(news.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<news_id>', methods=['DELETE'])
def delete_news(news_id):
    """Deleta uma notícia"""
    try:
        news = News.query.get(news_id)
        if not news:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        
        db.session.delete(news)
        db.session.commit()
        
        return jsonify({'message': 'Notícia deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

