from flask import Flask, request, jsonify, Blueprint
from api.models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin

api = Blueprint('api', __name__)
CORS(api, origins="https://literate-rotary-phone-5gv5xpv7q5grf7x95-3000.app.github.dev", 
     supports_credentials=True)

# User Signup
@api.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin(
              methods=["POST", "OPTIONS"], 
              headers=["Content-Type", "Authorization"])
def signup():
    if request.method == 'OPTIONS':
        return '', 200  

    body = request.get_json()
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        user = User(email=body["email"], password=body["password"], is_active=True)
        db.session.add(user)
        db.session.commit()
        return jsonify({"msg": "User created!"}), 200
    return jsonify({"msg": "This email address it's already asociated to un account"}), 400


# User Login
@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Incorrect email or password"}), 401

# Protected Route
@api.route('/private', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
