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

import {
  useMovieDetails,
  useWatchlist,
  useLikedMovies,
} from "@/hooks/movieQueries";
import {
  useWatchlistMutation,
  useLikeDislikeMutation,
  useCreateWatchRoom,
} from "@/hooks/movieMutations";
import { BackIcon, StarIcon } from "@/assets/IconComponents";

const VIDSRC_API_URL = import.meta.env.VITE_VIDSRC_API_URL;

export const MovieDetailsPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data: movie,
    isLoading: isLoadingMovie,
    error: movieError,
  } = useMovieDetails(id);
  const { data: watchlist = [] } = useWatchlist(isLoggedIn);
  const { data: likedMovies } = useLikedMovies(isLoggedIn);

  const watchlistMutation = useWatchlistMutation();
  const likeDislikeMutation = useLikeDislikeMutation();
  const createWatchRoomMutation = useCreateWatchRoom();

  const isAdded = useMemo(
    () => watchlist.includes(Number(id)),
    [watchlist, id]
  );

  const isLiked = useMemo(() => {
    if (!likedMovies) return null;
    return likedMovies.liked.includes(Number(id))
      ? true
      : likedMovies.disliked.includes(Number(id))
      ? false
      : null;
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

  const WatchlistButton = useMemo(
    () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleWatchlistToggle}
              disabled={!isLoggedIn || watchlistMutation.isPending}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isAdded ? (
                <BsBookmarkPlusFill className="text-yellow-400" size={24} />
              ) : (
                <BsBookmarkPlus className="text-white" size={24} />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isLoggedIn
                ? "Add to Watchlist"
                : "Please Login to Add to Watchlist"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    [isLoggedIn, isAdded, watchlistMutation.isPending]
  );

  const WatchTogetherButton =
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleWatchTogether}
              disabled={!isLoggedIn || createWatchRoomMutation.isPending}
              className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <GiAerialSignal className="text-white" size={24} />
              <span className="text-white font-semibold">Watch Together</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isLoggedIn ? "Watch Together" : "Please Login to Watch together"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

  if (movieError) {
    return (
      <div className="text-red-500 text-center py-20">
        Error loading movie details
      </div>
    );
  }

  if (isLoadingMovie || !movie) {
    return <div className="text-gray-500 text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-end p-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <StarIcon />
                <span className="text-lg font-semibold">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <p className="text-gray-300">{movie.release_date}</p>
              <span className="text-gray-300">|</span>
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="absolute top-8 left-8 bg-gray-800 rounded-full p-3 hover:bg-gray-700 transition-colors"
        >
          <BackIcon />
        </Link>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <p className="text-gray-300 mb-8">{movie.overview}</p>

            {/* Video Player */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-8">
              <div className="relative" style={{ paddingTop: "56.25%" }}>
                {/* <iframe
                  src={`${VIDSRC_API_URL}/movie/${movie.id}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                /> */}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Watchlist Button */}
            <div className="flex justify-center lg:justify-start">
              {WatchlistButton}
            </div>

            {/* Watch Together Button */}
            <div className="flex justify-center lg:justify-start">
              {WatchTogetherButton}
            </div>

            {/* Like/Dislike */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <HandleLikeDislike
                isLoggedIn={isLoggedIn}
                isLiked={isLiked}
                handleLikeDislike={handleLikeDislike}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
