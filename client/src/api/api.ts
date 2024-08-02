import axios, { HttpStatusCode } from 'axios';
import { refreshAuthToken } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:3000/', //import.meta.env.SERVER_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      try {
        const token = await refreshAuthToken();
        localStorage.setItem('token', token);
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const get = async (
  url: string,
  params?: any,
  withCredentials?: boolean
) => {
  try {
    const response = await api.get(url, { params, withCredentials });

    return response.data;
  } catch (error) {
    console.error(`GET request to ${url} failed`, error);
    throw error;
  }
};

export const post = async (
  url: string,
  data: any,
  params?: any,
  withCredentials?: boolean
) => {
  try {
    const response = await api.post(url, data, { params, withCredentials });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(`POST request to ${url} failed`, error);
    throw error;
  }
};

export const put = async (
  url: string,
  data: any,
  params?: any,
  withCredentials?: boolean
) => {
  try {
    const response = await api.put(url, data, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${url} failed`, error);
    throw error;
  }
};

export const del = async (
  url: string,
  params?: any,
  withCredentials?: boolean
) => {
  try {
    const response = await api.delete(url, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${url} failed`, error);
    throw error;
  }
};

export const patch = async (
  url: string,
  data: any,
  withCredentials?: boolean
) => {
  try {
    const response = await api.patch(url, data, { withCredentials });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${url} failed`, error);
    throw error;
  }
};
