import axios from "axios";
import api from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const useWatchlistMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, isAdding }: { id: string; isAdding: boolean }) => {
        if (isAdding) {
          await api.post(`/movies/watchlist/${id}`);
        } else {
          await api.delete(`/movies/watchlist/${id}`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      },
    });
  };
  
export const useLikeDislikeMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, isLiked }: { id: string; isLiked: boolean }) => {
        const { data } = await api.post(`/movies/${id}/like`, { is_liked: isLiked });
        return data.like;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['likedMovies'] });
      },
    });
  };
  
export const useCreateWatchRoom = () => {
    return useMutation({
      mutationFn: async () => {
        const { data } = await axios.post(
          `${BACKEND_API_URL}/watch/create_room`
        );
        return data.roomId;
      },
    });
  };
  