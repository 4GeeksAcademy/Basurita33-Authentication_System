"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint, current_app
from api.models import db, User
from api.utils import APIException
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
import datetime

api = Blueprint('api', __name__)
bcrypt = Bcrypt()
CORS(api)  # Allow CORS

# Signup route
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()  
    email = data.get('email')
    password = data.get('password')

    # Validate data
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'User already exists'}), 400

    # Hash password and save new user
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# Login route
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json() 
    email = data.get('email')
    password = data.get('password')

    # Validate data
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400

    # Check if the user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Verify password
    if bcrypt.check_password_hash(user.password, password):
        # Generate JWT token
        token = jwt.encode({
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Incorrect password'}), 401

# Private route (token validation)
@api.route('/private', methods=['GET'])
def private():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 401

    try:
        # Decode the token
        jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return jsonify({'message': 'Access granted'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

