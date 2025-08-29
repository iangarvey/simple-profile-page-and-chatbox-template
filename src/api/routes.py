"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import os
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# ============ Register ============#


@api.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "email and password required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400


    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        email=data['email'],
        password=hashed_password,
        is_active=False
        )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e: 
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ============ Login ============#

@ api.route("/token", methods=["POST"])
def create_token():
    email=request.json.get("email", None)
    password=request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token=create_access_token(identity=email)
    return jsonify(access_token=access_token)
