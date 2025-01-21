import { MovieDetails } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsBookmarkPlus, BsBookmarkPlusFill } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GiAerialSignal } from "react-icons/gi";
import HandleLikeDislike from "@/components/HandleLikeDislike";

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails>();
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/movies/${id}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (isLoggedIn) {
      api
        .get(`/movies/watchlist/all`)
        .then((response) => {
          const watchlistMovies = response.data.movies || [];
          setIsAdded(watchlistMovies.includes(Number(id)));
        })
        .catch((error) => {
          console.error(error);
        });
        api
        .get(`/movies/users/me/liked-movies`)
        .then((response) => {
          const likedMovies = response.data.movies.liked || [];
          const dislikedMovies = response.data.movies.disliked || [];
          console.log(likedMovies)
          if (likedMovies.includes(Number(id))){
            setIsLiked(true);
          } else if (dislikedMovies.includes(Number(id))){
            setIsLiked(false);
          } 
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id, isLoggedIn]);
  const handleAddToWatchlist = () => {
    api
      .post(`/movies/watchlist/${id}`)
      .then(() => {
        setIsAdded(true);
      })
      .catch((error) => {
        console.error("Error adding to watchlist:", error);
      });
  };

  const handleRemoveFromWatchlist = () => {
    api
      .delete(`/movies/watchlist/${id}`)
      .then(() => {
        setIsAdded(false);
      })
      .catch((error) => {
        console.error("Error removing from watchlist:", error);
      });
  };

  const handleLikeDislike = (action: boolean) => {
    api
      .post(`/movies/${id}/like`, { is_liked: action })
      .then((response) => {
        const updatedStatus = response.data.like;
        setIsLiked(updatedStatus);
      })
      .catch((error) => {
        console.error("Error liking/disliking movie:", error);
      });
  };

  const handleWatchTogether = async () => {
    const roomResponse = await axios.post(
      "http://localhost:8000/api/v1/watch/create_room"
    );
    const roomId = roomResponse.data.roomId;

    navigate(`/stream?roomId=${roomId}&movieId=${movie?.imdb_id}`);
  };

  if (!movie) {
    return <div>Movie not found</div>;
  }
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <Link
          to="/"
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
        <HandleLikeDislike
          isLoggedIn={isLoggedIn}
          isLiked={isLiked}
          handleLikeDislike={handleLikeDislike}
        />
        {isLoggedIn ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={
                    isAdded ? handleRemoveFromWatchlist : handleAddToWatchlist
                  }
                >
                  {!isAdded ? <BsBookmarkPlus /> : <BsBookmarkPlusFill />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Watchlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>{<BsBookmarkPlus />}</button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please Login to Add to Watchlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <p className="text-gray-600 mb-4">
          {movie.release_date} | {movie.genres.join(", ")}
        </p>
        <div className="flex items-center mb-4">
          <svg
            className="h-5 w-5 text-yellow-400 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-lg font-semibold">
            {movie.vote_count.toFixed(1)}
          </span>
        </div>
        <p className="text-gray-700 mb-6">{movie.overview}</p>
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <div
            style={{
              position: "relative",
              paddingTop: `calc(100% / (${"16/9"}))`,
            }}
          >
            {/* <iframe
              src={`https://vidsrc.xyz/embed/movie/${movie.id}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            /> */}
          </div>
        </div>
        {isLoggedIn ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleWatchTogether}>
                  <GiAerialSignal size={50} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Watch Together</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <GiAerialSignal size={50} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please Login to Watch together</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
