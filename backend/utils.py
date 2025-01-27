from passlib.context import CryptContext
import os
from datetime import datetime, timedelta, timezone
from typing import Union, Any
from jose import jwt
from fastapi import Depends, HTTPException
import logging
from dotenv import load_dotenv
import requests
load_dotenv

ACCESS_TOKEN_EXPIRE_MINUTES = 30*600
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
        
def fetch_genres():
    url = "https://api.themoviedb.org/3/genre/movie/list"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        genres = response.json().get("genres", [])
        return {genre["name"]: genre["id"] for genre in genres}
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch genres")








