from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from datetime import datetime, timezone
from database import get_db

Base = declarative_base()

class User(Base):
    __tablename__: str = 'users'

    _id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email}, is_active={self.is_active})>"

class Watchlist(Base):
    __tablename__: str = 'watchlist'

    _id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users._id"))
    movie_id = Column(Integer) 
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)




     
    