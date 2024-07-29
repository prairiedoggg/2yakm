import axios from 'axios';
import Cookies from 'js-cookie';
import { post } from '../../api/api';

const refreshingToken = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

refreshingToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await post('http://localhost:3000/api/auth/token', {
          refreshToken: refreshToken
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        Cookies.set('token', token);
        Cookies.set('refreshToken', newRefreshToken);

        return refreshingToken(originalRequest);
      } catch (err) {
        console.error('Refresh token failed:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default refreshingToken;
