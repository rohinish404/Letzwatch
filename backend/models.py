from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
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

    movie_likes = relationship("MovieLike", back_populates="user")

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email}, is_active={self.is_active})>"

class Watchlist(Base):
    __tablename__: str = 'watchlist'

    _id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users._id"))
    movie_id = Column(Integer) 
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

class MovieLike(Base):
    __tablename__ = "movie_likes"

    _id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    like = Column(Boolean, nullable=False)

    user = relationship("User", back_populates="movie_likes")





     
    