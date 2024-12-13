from fastapi import APIRouter
from .schemas import MovieSearchResponse, Movie, MovieDetails, Trending
import requests
from typing import List, Optional, Literal

router = APIRouter(
    tags=["Movies Routes"]
)

@router.get("/search", response_model=Optional[MovieSearchResponse])
async def get_movies(query: str,
    include_adult: bool = False,
    page: int = 1):
    url = f"https://api.themoviedb.org/3/search/movie?include_adult={include_adult}&language=en-US&page={page}"

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


