from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import MovieSearchResponse, Movie, MovieDetails, Trending, WatchlistAddRequest, WatchlistResponse
import requests
from typing import List, Optional, Literal
from deps import get_current_user
from models import User
router = APIRouter(
    tags=["Movies Routes"]
)
from models import Watchlist
from database import get_db
@router.get("/search", response_model=Optional[MovieSearchResponse])
async def get_movies(query: str,
    include_adult: bool = False):
    url = f"https://api.themoviedb.org/3/search/movie?include_adult={include_adult}&language=en-US&page=1"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
    }
    params = {
        "query": query
    }
    response = requests.get(url, headers=headers, params=params)
    print(response.text)
    return response.json()

@router.get("/{movie_id}", response_model=Optional[MovieDetails])
async def get_movie_details(movie_id: int):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
    }
    response = requests.get(url, headers=headers)
    print(response.text)
    return response.json()

@router.get("/trending/{time_window}", response_model=Optional[Trending])
async def get_trending(time_window: Literal["week"]):
    url = f"https://api.themoviedb.org/3/trending/movie/{time_window}"
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








