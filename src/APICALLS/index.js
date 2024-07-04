



import axios from 'axios';

// Function to get the latest token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios interceptor to update authorization header with latest token
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
