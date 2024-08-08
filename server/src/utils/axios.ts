import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createError } from './error';

const axiosRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios(config);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw createError('AxiosError', error.message, 500);
        } else {
            throw createError('UnknownError', '알 수 없는 에러발생', 500);
        }
    }
};

export default axiosRequest;