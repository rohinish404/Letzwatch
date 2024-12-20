from passlib.context import CryptContext
import os
from datetime import datetime, timedelta, timezone
from typing import Union, Any
from jose import jwt
from fastapi import Depends
import logging
from dotenv import load_dotenv
load_dotenv

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 30
ALGORITHM = "HS256"
JWT_SECRET_KEY = str(os.getenv('JWT_SECRET_KEY'))
JWT_REFRESH_SECRET_KEY = str(os.getenv('JWT_REFRESH_SECRET_KEY'))

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)

def create_access_token(user_data: dict, expires_delta: timedelta = None, refresh: bool = False) -> str:
    payload = {}

    payload["user"] = user_data
    payload["exp"] = datetime.now(timezone.utc) + (expires_delta if expires_delta is not None else timedelta(seconds=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload['refresh'] = refresh
    token = jwt.encode(payload, JWT_SECRET_KEY, ALGORITHM)
    return token

def decode_token(token: str):
    try:    
        token_data =  jwt.decode(
            token,
            JWT_SECRET_KEY,
            ALGORITHM
        )
        return token_data
    except jwt.JWTError as e:
        logging.exception(e)
