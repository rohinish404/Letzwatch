from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import MovieSearchResponse, MovieDetails, Trending, WatchlistResponse, LikeRequest, LikeResponse, GenreEnum, Genre
import requests
from typing import Optional, Literal, List
from deps import get_current_user
from models import User, MovieLike
from models import Watchlist
from database import get_db
import os

router = APIRouter(
    tags=["Movies Routes"]
)


TMBD_API_URL = os.getenv('TMBD_API_URL')

def get_genre_names(genre_ids: List[int]) -> List[str]:
    """Map genre IDs to genre names using the GenreEnum."""
    genre_names = []
    for genre_id in genre_ids:
        for genre in GenreEnum:
            if genre.value == genre_id:
                genre_names.append(genre.name)
                break
    return genre_names

@router.get("/search", response_model=Optional[MovieSearchResponse])
async def get_movies(query: str,
    include_adult: bool = False):
    url = f"{TMBD_API_URL}/search/movie?include_adult={include_adult}&language=en-US&page=1"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
    }
    params = {
        "query": query
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    for movie in data.get("results", []):
        if "genre_ids" in movie:
            genre_names = get_genre_names(movie["genre_ids"])
            movie["genres"] =  [Genre(id=i, name=j) for i, j in zip(movie["genre_ids"], genre_names)]
            # print(get_genre_names(movie["genre_ids"]))
    return data

@router.get("/{movie_id}", response_model=Optional[MovieDetails])
async def get_movie_details(movie_id: int):
    url = f"{TMBD_API_URL}/movie/{movie_id}"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    for movie in data.get("results", []):
        if "genre_ids" in movie:
            movie["genre_names"] = get_genre_names(movie["genre_ids"])
            print(get_genre_names(movie["genre_ids"]))
    return data

@router.get("/trending/{time_window}", response_model=Optional[Trending])
async def get_trending(time_window: Literal["week"]):
    url = f"{TMBD_API_URL}/trending/movie/{time_window}"
    headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
        }
    response = requests.get(url, headers=headers)
    print(response.text)
    return response.json()


@router.post("/watchlist/{movie_id}", response_model=WatchlistResponse)
async def add_to_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.get("user_id")
    existing_entry = db.query(Watchlist).filter(
        Watchlist.user_id == user_id, 
        Watchlist.movie_id == movie_id
    ).first()
    if existing_entry:
        raise HTTPException(status_code=400, detail="Movie already in watchlist")
    
    new_entry = Watchlist(user_id=user_id, movie_id=movie_id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    watchlist_movie_ids = db.query(Watchlist.movie_id).filter(Watchlist.user_id == user_id).all()
    movie_ids = [movie_id[0] for movie_id in watchlist_movie_ids] 

    watchlist_resp = WatchlistResponse(user_id=user_id, movies=movie_ids)
    return watchlist_resp

@router.delete("/watchlist/{movie_id}", response_model=WatchlistResponse)
def remove_from_watchlist(
    movie_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    user_id =  current_user.get("user_id")
    entry = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == movie_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Movie not in watchlist")

    # Remove the movie
    db.delete(entry)
    db.commit()

    watchlist_movies = db.query(Watchlist.movie_id).filter(
        Watchlist.user_id == user_id
    ).all()
    movie_ids = [movie_id[0] for movie_id in watchlist_movies] 
    return {"user_id": user_id, "movies": movie_ids}

@router.get("/watchlist/all")
def get_watchlist(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    user_id =  current_user.get("user_id")
    watchlist_movies = db.query(Watchlist.movie_id).filter(
        Watchlist.user_id == user_id
    ).all()
    movie_ids = [movie_id[0] for movie_id in watchlist_movies] 
    return {"user_id": user_id, "movies": movie_ids}


@router.post("/{movie_id}/like", response_model=LikeResponse)
def like_movie(movie_id: int, like_request: LikeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id =  current_user.get("user_id")
    existing_like = db.query(MovieLike).filter(
        MovieLike.user_id == user_id,
        MovieLike.movie_id == movie_id
    ).first()

    if existing_like:
        existing_like.like = like_request.is_liked
    else:
        new_like = MovieLike(user_id=user_id, movie_id=movie_id, like=like_request.is_liked)
        db.add(new_like)
    db.commit()


    return {
        "user_id": user_id,
        "movie_id": movie_id,
        "like": like_request.is_liked
    }

#return total dislikes and likes for a movie
@router.get("/movies/{movie_id}/likes", response_model=dict)
def get_likes(movie_id: int, db: Session = Depends(get_db)):
    likes = db.query(MovieLike).filter(MovieLike.movie_id == movie_id, MovieLike.like == True).count()
    dislikes = db.query(MovieLike).filter(MovieLike.movie_id == movie_id, MovieLike.like == False).count()
    return {"likes": likes, "dislikes": dislikes}


@router.get("/users/me/liked-movies")
async def get_user_liked_movies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("user_id")
    
    liked_movies = db.query(MovieLike.movie_id).filter(
            MovieLike.user_id == user_id,
            MovieLike.like == True
    ).all()
    disliked_movies = db.query(MovieLike.movie_id).filter(
            MovieLike.user_id == user_id,
            MovieLike.like == False
    ).all()
    
    liked_movie_ids = [movie[0] for movie in liked_movies]
    disliked_movie_ids = [movie[0] for movie in disliked_movies]
    return {"user_id": user_id, "movies": {"liked":liked_movie_ids, "disliked":disliked_movie_ids}}








