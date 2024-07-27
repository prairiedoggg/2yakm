import axios from 'axios';


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
  withCredentials?: boolean
) => {
  try {
    const response = await api.post(url, data, { withCredentials });
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
  withCredentials?: boolean
) => {
  try {
    const response = await api.put(url, data, { withCredentials });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${url} failed`, error);
    throw error;
  }
};

export const del = async (url: string, withCredentials?: boolean) => {
  try {
    const response = await api.delete(url, { withCredentials });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${url} failed`, error);
    throw error;
  }
};
