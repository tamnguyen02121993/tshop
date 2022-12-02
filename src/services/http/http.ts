import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const http = axios.create();

http.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default http;
