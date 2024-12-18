from fastapi import APIRouter, Depends, FastAPI, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from .schemas import TokenSchema, UserOut, UserAuth, Token
from utils import get_hashed_password, verify_password, create_access_token, create_refresh_token
from models import User
from sqlalchemy.orm import Session
from database import get_db
from deps import get_current_user
from utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)
from jose import JWTError, jwt
router = APIRouter(
    tags=["User Routes"]
)

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
            detail="Incorrect email or password"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


@router.get('/me', summary='Get details of currently logged in user')
async def get_me(user: User = Depends(get_current_user)):
    return user

    
# @router.get('/verify_token/{token}', summary='verify the token from frontend')
# async def verify_user_token(token: str):
#     verify_token(token=token)
#     return {"message": "Token is valid!"}
