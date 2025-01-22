from fastapi import FastAPI
import routes.auth as auth
import routes.movies as movies
import routes.watch_together.watchtogether as watchtogether
from fastapi.middleware.cors import CORSMiddleware
from routes.watch_together.watchtogether import socket_app
import os

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')
version = 'v1'

app = FastAPI(version=version)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"/api/{version}/auth")
app.include_router(movies.router, prefix=f"/api/{version}/movies")
app.include_router(watchtogether.router, prefix=f"/api/{version}/watch")

app.mount('/', app=socket_app)

