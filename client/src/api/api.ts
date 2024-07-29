import axios from 'axios';
import { IoBodySharp } from 'react-icons/io5';

const api = axios.create({
  baseURL: 'http://localhost:3000/', //import.meta.env.SERVER_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

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
