import { MovieDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/api";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

const fetchMovie = async (id: string): Promise<MovieDetails> => {
  const { data } = await axios.get(`${BACKEND_API_URL}/movies/${id}`);
  return data;
};

const fetchWatchlist = async () => {
  const { data } = await api.get("/movies/watchlist/all");
  return data.movies || [];
};

const fetchLikedMovies = async () => {
  const { data } = await api.get("/movies/users/me/liked-movies");
  return {
    liked: data.movies.liked || [],
    disliked: data.movies.disliked || [],
  };
};

export const useMovieDetails = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useWatchlist = (isLoggedIn: boolean) => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
};

export const useLikedMovies = (isLoggedIn: boolean) => {
  return useQuery({
    queryKey: ["likedMovies"],
    queryFn: fetchLikedMovies,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
};
