import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/',//import.meta.env.SERVER_BASE_URL,
    timeout: 10000,
});

export const get = async (url: string, params?: any) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET request to ${url} failed`, error);
      throw error;
    }
};

export const post = async (url: string, data: any) => {
    try {
      const response = await api.post(url, data);
      console.log('확인:',response);
      return response.data;
    } catch (error) {
      console.error(`POST request to ${url} failed`, error);
      throw error;
    }
};

export const put = async (url: string, data: any) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT request to ${url} failed`, error);
      throw error;
    }
};

export const del = async (url: string) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE request to ${url} failed`, error);
      throw error;
    }
};