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
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    removeToken();
  };
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
      // Check if the route matches the specified ones
      if (config.url && ['movies/watchlist/all', '/protected-route2'].includes(config.url)) {
        if (!config._retry) {
          config._retry = false;
        }
        config.headers.Authorization = 
          !config._retry && getToken()
            ? `Bearer ${getToken()}`
            : config.headers.Authorization;
      }
      return config;
    });
  
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [getToken]);
  
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Check if the route matches the specified ones
        if (error.config?.url && ['movies/watchlist/all', '/protected-route2'].includes(error.config.url)) {
          if (error.response && error.response.status === 403) {
            try {
              const newToken = await refreshAccessToken();
              error.config.headers.Authorization = `Bearer ${newToken}`;
              error.config._retry = true;
              return api(error.config);
            } catch (err) {
              console.error('Failed to refresh access token:', err);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [getToken]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />  
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
