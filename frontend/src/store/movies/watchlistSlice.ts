import { createSlice } from '@reduxjs/toolkit';

interface WatchlistState {
  isAdded: boolean;
}

const initialState: WatchlistState = {
  isAdded: false,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    add: (state) => {
      state.isAdded = true;
    },
    remove: (state) => {
      state.isAdded = false;
    },
    setAddWatchlist: (state, action) => {
      state.isAdded = action.payload;
    },
  },
});

export const { add, remove, setAddWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;
