from typing import List, Optional, Union
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class Movie(BaseModel):
    adult: bool
    backdrop_path: Optional[str] = None
    genre_ids: Optional[List[int]] = None
    id: int
    original_language: Optional[str] = None
    original_title: Optional[str] = None
    overview: Optional[str] = None
    popularity: Optional[float] = None
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    title: Optional[str] = None
    video: Optional[bool] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None

class MovieSearchResponse(BaseModel):
    page: int
    results: Optional[List[Movie]] = None
    total_pages: Optional[int] = None
    total_results: Optional[int] = None

class Genre(BaseModel):
    id: int
    name: Optional[str] = None

class ProductionCompany(BaseModel):
    id: int
    logo_path: Optional[str] = None
    name: Optional[str] = None
    origin_country: Optional[str] = None

class ProductionCountry(BaseModel):
    iso_3166_1: Optional[str] = None
    name: Optional[str] = None

class SpokenLanguage(BaseModel):
    english_name: Optional[str] = None
    iso_639_1: Optional[str] = None
    name: Optional[str] = None

class Collection(BaseModel):
    id: int
    name: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None

class MovieDetails(BaseModel):
    adult: bool
    backdrop_path: Optional[str] = None
    belongs_to_collection: Optional[Union[Collection, str]] = None
    budget: Optional[int] = None
    genres: Optional[List[Genre]] = None
    homepage: Optional[str] = None
    id: int
    imdb_id: Optional[str] = None
    origin_country: Optional[List[str]] = None
    original_language: Optional[str] = None
    original_title: Optional[str] = None
    overview: Optional[str] = None
    popularity: Optional[float] = None
    poster_path: Optional[str] = None
    production_companies: Optional[List[ProductionCompany]] = None
    production_countries: Optional[List[ProductionCountry]] = None
    release_date: Optional[str] = None
    revenue: Optional[int] = None
    runtime: Optional[int] = None
    spoken_languages: Optional[List[SpokenLanguage]] = None
    status: Optional[str] = None
    tagline: Optional[str] = None
    title: Optional[str] = None
    video: Optional[bool] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None

class Trending(BaseModel):
    page: int
    results: Optional[List[Movie]] = None

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserAuth(BaseModel):
    email: str = Field(..., description="user email")
    username: Optional[str] = None
    password: str = Field(..., min_length=5, max_length=24, description="user password")

class UserOut(BaseModel):
    _id: UUID
    username: Optional[str] = None
    hashed_password: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    email: Optional[str] = None

# Watchlist request schema
class WatchlistAddRequest(BaseModel):
    movie_id: int  # ID of the movie to add to the watchlist

# Watchlist response schema
class WatchlistResponse(BaseModel):
    user_id: int
    movies: Optional[List[int]] = None
