from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
from pydantic import BaseModel, Field
from datetime import datetime

class Movie(BaseModel):
    adult: bool
    backdrop_path: Optional[str]
    genre_ids: List[int]
    id: int
    original_language: str
    original_title: str
    overview: str
    popularity: float
    poster_path: Optional[str]
    release_date: Optional[str]
    title: str
    video: bool
    vote_average: float
    vote_count: int

class MovieSearchResponse(BaseModel):
    page: int
    results: List[Movie]
    total_pages: int
    total_results: int

class Genre(BaseModel):
    id: int
    name: str


class ProductionCompany(BaseModel):
    id: int
    logo_path: Optional[str]
    name: str
    origin_country: str


class ProductionCountry(BaseModel):
    iso_3166_1: str
    name: str


class SpokenLanguage(BaseModel):
    english_name: str
    iso_639_1: str
    name: str


class MovieDetails(BaseModel):
    adult: bool
    backdrop_path: Optional[str]
    belongs_to_collection: Optional[str]
    budget: int
    genres: List[Genre]
    homepage: Optional[str]
    id: int
    imdb_id: Optional[str]
    origin_country: List[str]
    original_language: str
    original_title: str
    overview: str
    popularity: float
    poster_path: Optional[str]
    production_companies: List[ProductionCompany]
    production_countries: List[ProductionCountry]
    release_date: str
    revenue: int
    runtime: Optional[int]
    spoken_languages: List[SpokenLanguage]
    status: str
    tagline: Optional[str]
    title: str
    video: bool
    vote_average: float
    vote_count: int


class Trending(BaseModel):
    page: int
    results: List[Movie]


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    

class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None
    
class Token(BaseModel):
    access_token: str
    token_type: str


class UserAuth(BaseModel):
    email: str = Field(..., description="user email")
    username: str
    password: str = Field(..., min_length=5, max_length=24, description="user password")
    

class UserOut(BaseModel):
    _id: UUID
    username: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    email: str



# Watchlist request schema
class WatchlistAddRequest(BaseModel):
    movie_id: int  # ID of the movie to add to the watchlist

# Watchlist response schema
class WatchlistResponse(BaseModel):
    user_id: int
    movies: List[int]
