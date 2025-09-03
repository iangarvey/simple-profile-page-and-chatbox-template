"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import os
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# ============ Register ============#


@api.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if user exists and create user 
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "Username or email already exists"}), 400

    user = User(username=username, email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "User registered successfully", "access_token": access_token}), 201

    # return jsonify({
    #     "token": "<JWT_TOKEN>",
    #     "message": "User registered successfully",
    #     "access_token": access_token,
    #     "user": user.serialize()
    # }), 201




# ============ Login ============#

@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad username or password"}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({"msg": "Account is inactive"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({ "token": access_token, "user_id": user.id })

# ============ Logout ============#

@api.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        user.is_active = False
        db.session.commit()

    return jsonify({"message": "Logged out successfully"}), 200


# ============ Get Profile (Private) ============#

@api.route('/myprofile', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "message": "The private page works!",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200

