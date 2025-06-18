from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User # Assuming 'User' model is defined in models.user

user_bp = Blueprint('user', __name__)

def require_admin():
    """
    Helper function to check if the current authenticated user is an admin.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return False
    return True

@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """
    Retrieves a list of all users.
    Accessible by any authenticated user.
    """
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    """
    Creates a new user.
    Only accessible by administrators.
    """
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password') # Assuming you'll hash this in your User model

        if not username or not email or not password:
            return jsonify({'error': 'Nome de usuário, email e senha são obrigatórios'}), 400

        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Nome de usuário já existe'}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email já cadastrado'}), 400

        user = User(username=username, email=email)
        user.set_password(password) # Assuming a method to hash password

        db.session.add(user)
        db.session.commit()
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """
    Retrieves a single user by ID.
    Accessible by any authenticated user.
    """
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        # get_or_404 handles 404, but for other errors:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Updates an existing user.
    Only accessible by administrators.
    """
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        user = User.query.get_or_404(user_id)
        data = request.get_json()

        if 'username' in data:
            # Check for duplicate username excluding the current user
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Nome de usuário já existe'}), 400
            user.username = data['username']

        if 'email' in data:
            # Check for duplicate email excluding the current user
            existing_email_user = User.query.filter_by(email=data['email']).first()
            if existing_email_user and existing_email_user.id != user_id:
                return jsonify({'error': 'Email já cadastrado'}), 400
            user.email = data['email']

        if 'password' in data:
            user.set_password(data['password']) # Assuming a method to hash password

        if 'is_admin' in data:
            user.is_admin = data['is_admin'] # Allows admins to promote/demote

        db.session.commit()
        return jsonify({
            'message': 'Usuário atualizado com sucesso',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """
    Deletes a user.
    Only accessible by administrators.
    """
    try:
        if not require_admin():
            return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403

        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário excluído com sucesso'}), 204

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500