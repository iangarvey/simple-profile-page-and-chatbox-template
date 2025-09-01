from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, DateTime 
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Method to hash a password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to verify a password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
    # Relationships
    profile = relationship('Profile', back_populates='user', uselist=False, cascade='all, delete-orphan') # cascade = Automatically handles related object deletion
    messages = relationship('Message', back_populates='user')
    conversations = relationship('ConversationMember', back_populates='user')
    
class Profile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    profile_pic_url: Mapped[str] = mapped_column(db.Text)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "profile_pic_url": self.profile_pic_url
        }
    
    # Relationship
    user = relationship('User', back_populates='profile')

class Conversation(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat()
        }
    
    # Relationships
    messages = relationship('Message', back_populates='conversation', cascade='all, delete-orphan')
    members = relationship('ConversationMember', back_populates='conversation', cascade='all, delete-orphan')

class ConversationMember(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True) 
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversation.id"), index=True)

    def serialize(self):
        return {
            "id": self.id, 
            "user_id": self.user_id,
            "conversation_id": self.conversation_id
        }

    # Relationships (many-to-many between User and Conversation)
    user = relationship('User', back_populates='conversations')
    conversation = relationship('Conversation', back_populates='members')

class Message(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversation.id"), index=True)
    content: Mapped[str] = mapped_column(db.Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_read: Mapped[bool] = mapped_column(Boolean(), default=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "conversation_id": self.conversation_id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "is_read": self.is_read
        }

    # Relationships
    user = relationship('User', back_populates='messages')
    conversation = relationship('Conversation', back_populates='messages')