from fastapi import FastAPI
import routes.auth as auth
import routes.movies as movies
from fastapi.middleware.cors import CORSMiddleware

SECRET_KEY = "6dcec77ddfea1008ac2da1cf6d82e2b2d3603f2c251d7900b4989268cbf7db76"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90
version = 'v1'

app = FastAPI(version=version)

origins = [
    "http://localhost:5173",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"/api/{version}/auth")
app.include_router(movies.router, prefix=f"/api/{version}/movies")

