from fastapi import APIRouter, Body, Depends, FastAPI, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from deps import RefreshTokenBearer, get_current_user
from .schemas import TokenSchema, UserOut, UserAuth, Token
from utils import decode_token, get_hashed_password, verify_password, create_access_token
from models import User
from sqlalchemy.orm import Session
from database import get_db
from utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.responses import JSONResponse
router = APIRouter(
    tags=["User Routes"]
)
REFRESH_TOKEN_EXPIRE = 30
@router.post("/signup", response_model=UserOut)
def signup(user: UserAuth, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_hashed_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post('/login', summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist!"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password!"
        )

    access_token = create_access_token(user_data={
        'email': user.email,
        'user_id': user._id
    })
    refresh_token = create_access_token(user_data={
        'email': user.email,
        'user_id': user._id
    },refresh=True,expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE))

    response = JSONResponse(content={
        "message": "Login successfull!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user":{
            "email": user.email,
            "id": str(user._id)
        }
    })
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True, 
        secure=True,  
        samesite="strict", 
        max_age=REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 
    )
    return response



@router.get('/me', summary='Get details of currently logged in user')
async def get_me(user: User = Depends(get_current_user)):
    return user


class TokenBody(BaseModel):
    token: str

@router.post("/refresh_token")
async def get_new_access_token(token: TokenBody):
    token_details = decode_token(token.token)
    expiry_timestamp = token_details["exp"]

    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_access_token(user_data=token_details["user"])

        return JSONResponse(content={"access_token": new_access_token})

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or expired token"
    )
