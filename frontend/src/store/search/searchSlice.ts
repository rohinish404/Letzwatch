import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieSearchResponse } from '@/types';

export interface Movie {
    adult: boolean;
    backdrop_path?: string | null;
    genre_ids?: number[] | null;
    id: number;
    original_language?: string | null;
    original_title?: string | null;
    overview?: string | null;
    popularity?: number | null;
    poster_path?: string | null;
    release_date?: string | null;
    title?: string | null;
    video?: boolean | null;
    vote_average?: number | null;
    vote_count?: number | null;
  }
  


  const initialState: MovieSearchResponse = {
    page: 1,
    results: [],
    total_pages: null,
    total_results: null,
  };
  
  const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
      setSearchResponse: (state, action: PayloadAction<MovieSearchResponse>) => {
        return action.payload;
      },
      clearSearchResponse: () => initialState,
    },
  });
  
  export const { setSearchResponse, clearSearchResponse } = searchSlice.actions;
  
  export default searchSlice.reducer;