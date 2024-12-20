from typing import Union, Any
from datetime import datetime
from fastapi import Depends, HTTPException, status, Request
from fastapi.security.http import HTTPAuthorizationCredentials
from fastapi.security import OAuth2AuthorizationCodeBearer, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
from models import User
from utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)
from utils import decode_token
from jose import jwt
from pydantic import ValidationError
from routes.schemas import TokenPayload
from database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request,  token: str = Depends(oauth2_scheme)) -> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)

        token = creds.credentials

        token_data = decode_token(token)

        if not self.token_valid(token):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or expired token"
            )

        self.verify_token_data(token_data)

        return token_data

    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)

        return token_data is not None

    def verify_token_data(self, token_data):
        raise NotImplementedError("Please Override this method in child classes")


class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please provide an access token"
            )


class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please provide a refresh token"
            )
        
async def get_current_user(
    token_data: dict = Depends(AccessTokenBearer()), 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == token_data["user"]["email"]).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return {'username': user.username, 'user_id': user._id}