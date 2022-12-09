import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IUserInfo } from '../../interfaces';
import { LOCALSTORAGE_USER_INFO_KEY } from '../../utils';

const http = axios.create();

http.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const userInfoString = localStorage.getItem(LOCALSTORAGE_USER_INFO_KEY);
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString) as IUserInfo;
      config.headers = {
        Authorization: `Bearer ${userInfo.accessToken}`,
      };
    }
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
