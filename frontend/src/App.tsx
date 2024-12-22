import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { useEffect, useLayoutEffect, useState } from 'react';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage'
import { getToken, isAuthenticated, refreshAccessToken, removeToken } from './utils';
import api from './api';
import { InternalAxiosRequestConfig } from 'axios';
import SearchResultsPage from './pages/SearchResultsPage';
import { useDispatch } from 'react-redux';
import { logout, setAuthState } from './store/auth/authSlice';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthState(isAuthenticated()));
  }, [dispatch]);

  const token = getToken();
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config: CustomAxiosRequestConfig) => {

        if (!config._retry) {
          config._retry = false;
        }
        config.headers.Authorization = 
          !config._retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;

      return config;
    });
  
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);
  
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
          if (error.response && error.response.status === 403) {
            try {
              const newToken = await refreshAccessToken();
              error.config.headers.Authorization = `Bearer ${newToken}`;
              error.config._retry = true;
              return api(error.config);
            } catch (err) {
              console.error('Failed to refresh access token:', err);
              dispatch(logout());
            }
        }
        return Promise.reject(error);
      }
    );
  
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />  
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
