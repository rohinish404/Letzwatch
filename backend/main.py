from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import routes.auth as auth
import routes.movies as movies

SECRET_KEY = "6dcec77ddfea1008ac2da1cf6d82e2b2d3603f2c251d7900b4989268cbf7db76"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90
version = 'v1'

app = FastAPI(version=version)

app.include_router(auth.router, prefix=f"/api/{version}/auth")
app.include_router(movies.router, prefix=f"/api/{version}/movies")

