import axios, { InternalAxiosRequestConfig } from 'axios';
import { useLayoutEffect } from 'react';
import { getToken, refreshAccessToken } from './utils';


const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
});


export default api;