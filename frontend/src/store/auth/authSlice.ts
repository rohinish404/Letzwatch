import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
    setAuthState: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { login, logout, setAuthState } = authSlice.actions;

export default authSlice.reducer;
