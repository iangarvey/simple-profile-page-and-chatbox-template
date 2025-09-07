"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profile, Conversation, ConversationMember, Message
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


# ============ Get My Profile (Private) ============#

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

# ============ Search By Username ============#

@api.route('/profile/<username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
        }
    }), 200

# ============ GET Contact Tab Data ============#
@api.route('/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    current_user_id = get_jwt_identity()
    
    # Get all conversations where current user is a member
    user_conversations = ConversationMember.query.filter_by(user_id=current_user_id).all()
    
    contacts = []
    for conv_member in user_conversations:
        # Get other members in the conversation (excluding current user)
        other_members = ConversationMember.query.filter(
            ConversationMember.conversation_id == conv_member.conversation_id,
            ConversationMember.user_id != current_user_id
        ).all()
        
        for other_member in other_members:
            contact_user = User.query.get(other_member.user_id)
            if contact_user:
                contacts.append({
                    "id": contact_user.id,
                    "username": contact_user.username,
                    "conversation_id": conv_member.conversation_id
                })
    
    return jsonify({"contacts": contacts}), 200

# ============ Create or Get Conversation ============#
@api.route('/conversations', methods=['POST'])
@jwt_required()
def create_or_get_conversation():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    contact_user_id = data.get('contact_user_id')
    
    if not contact_user_id:
        return jsonify({"error": "Contact user ID is required"}), 400
    
    # Check if conversation already exists between these two users
    existing_conversation = db.session.query(Conversation).join(
        ConversationMember, Conversation.id == ConversationMember.conversation_id
    ).filter(
        ConversationMember.user_id.in_([current_user_id, contact_user_id])
    ).group_by(Conversation.id).having(
        db.func.count(ConversationMember.user_id) == 2
    ).first()
    
    if existing_conversation:
        # Return existing conversation
        return jsonify({
            "conversation_id": existing_conversation.id,
            "message": "Conversation already exists"
        }), 200
    
    # Create new conversation
    new_conversation = Conversation()
    db.session.add(new_conversation)
    db.session.flush()  # Get the ID without committing
    
    # Add both users as members
    member1 = ConversationMember(user_id=current_user_id, conversation_id=new_conversation.id)
    member2 = ConversationMember(user_id=contact_user_id, conversation_id=new_conversation.id)
    
    db.session.add(member1)
    db.session.add(member2)
    db.session.commit()
    
    return jsonify({
        "conversation_id": new_conversation.id,
        "message": "Conversation created successfully"
    }), 201



# @api.route('/get-messages', methods=['GET'])
# @jwt_required()
# def get_messages():