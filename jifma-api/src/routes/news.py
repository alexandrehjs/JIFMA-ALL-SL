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