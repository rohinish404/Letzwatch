import Cookies from 'js-cookie';
import axios from 'axios';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };

  export const refreshAccessToken = async () => {
    try {
      const refresh_token = Cookies.get('token');
      console.log(refresh_token);
      const body = {token: String(refresh_token)}
      const response =  await axios.post(`${BACKEND_API_URL}/auth/refresh_token`, body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const { access_token } = response.data;
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        }
      localStorage.setItem('token', access_token)
      console.log('Access token refreshed:', access_token);
      return access_token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      
    }
  };
  