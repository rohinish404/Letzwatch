import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/searchSlice';
import authReducer from './auth/authSlice'; 
export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
    },
    });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;