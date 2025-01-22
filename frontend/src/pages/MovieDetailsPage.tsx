import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsBookmarkPlus, BsBookmarkPlusFill } from "react-icons/bs";
import { GiAerialSignal } from "react-icons/gi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import HandleLikeDislike from "@/components/HandleLikeDislike";

import { useMovieDetails, useWatchlist, useLikedMovies } from "@/hooks/movieQueries";
import { 
  useWatchlistMutation, 
  useLikeDislikeMutation, 
  useCreateWatchRoom 
} from "@/hooks/movieMutations";
import { BackIcon, StarIcon } from "@/assets/IconComponents";

const VIDSRC_API_URL = import.meta.env.VITE_VIDSRC_API_URL;

export const MovieDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useMovieDetails(id);
  const { data: watchlist = [] } = useWatchlist(isLoggedIn);
  const { data: likedMovies } = useLikedMovies(isLoggedIn);

  const watchlistMutation = useWatchlistMutation();
  const likeDislikeMutation = useLikeDislikeMutation();
  const createWatchRoomMutation = useCreateWatchRoom();

  const isAdded = useMemo(() => 
    watchlist.includes(Number(id)),
    [watchlist, id]
  );

  const isLiked = useMemo(() => {
    if (!likedMovies) return null;
    return likedMovies.liked.includes(Number(id)) ? true :
           likedMovies.disliked.includes(Number(id)) ? false : null;
  }, [likedMovies, id]);

  const handleWatchlistToggle = async () => {
    if (!isLoggedIn) return;
    await watchlistMutation.mutateAsync({ id, isAdding: !isAdded });
  };

  const handleLikeDislike = async (action: boolean) => {
    if (!isLoggedIn) return;
    await likeDislikeMutation.mutateAsync({ id, isLiked: action });
  };

  const handleWatchTogether = async () => {
    if (!isLoggedIn || !movie) return;
    const roomId = await createWatchRoomMutation.mutateAsync();
    navigate(`/stream?roomId=${roomId}&movieId=${movie.imdb_id}`);
  };

  const WatchlistButton = useMemo(() => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleWatchlistToggle}
            disabled={!isLoggedIn || watchlistMutation.isPending}
          >
            {isAdded ? <BsBookmarkPlusFill /> : <BsBookmarkPlus />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLoggedIn ? 'Add to Watchlist' : 'Please Login to Add to Watchlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ), [isLoggedIn, isAdded, watchlistMutation.isPending]);

  const WatchTogetherButton = useMemo(() => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleWatchTogether}
            disabled={!isLoggedIn || createWatchRoomMutation.isPending}
          >
            <GiAerialSignal size={50} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLoggedIn ? 'Watch Together' : 'Please Login to Watch together'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ), [isLoggedIn, createWatchRoomMutation.isPending]);

  if (movieError) {
    return <div className="text-red-500">Error loading movie details</div>;
  }

  if (isLoadingMovie || !movie) {
    return <div className="text-gray-500">Loading...</div>;
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
          <BackIcon />
        </Link>
      </div>
      
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
        
        <HandleLikeDislike
          isLoggedIn={isLoggedIn}
          isLiked={isLiked}
          handleLikeDislike={handleLikeDislike}
        />
        
        {WatchlistButton}

        <p className="text-gray-600 mb-4">
          {movie.release_date} | {movie.genres.join(", ")}
        </p>
        
        <div className="flex items-center mb-4">
          <StarIcon />
          <span className="text-lg font-semibold">
            {movie.vote_count.toFixed(1)}
          </span>
        </div>
        
        <p className="text-gray-700 mb-6">{movie.overview}</p>
        
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`${VIDSRC_API_URL}/movie/${movie.id}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        
        {WatchTogetherButton}
        
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