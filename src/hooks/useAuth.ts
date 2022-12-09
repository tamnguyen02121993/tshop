import { useState } from 'react';
import { IUserInfo } from '../interfaces';
import { LOCALSTORAGE_USER_INFO_KEY } from '../utils';

const useAuth = () => {
  const userInfoJson = localStorage.getItem(LOCALSTORAGE_USER_INFO_KEY);
  const [userInfo, setUserInfo] = useState<IUserInfo>(
    JSON.parse(userInfoJson || JSON.stringify({})) as IUserInfo
  );

  const storeUserInfoToLocalStorage = (userInfo: IUserInfo) => {
    const userInfoString = JSON.stringify(userInfo);
    localStorage.setItem(LOCALSTORAGE_USER_INFO_KEY, userInfoString);
    setUserInfo(userInfo);
  };

  const clearUserInfor = () => {
    localStorage.setItem(LOCALSTORAGE_USER_INFO_KEY, JSON.stringify({}));
  };

  return {
    userInfo,
    storeUserInfoToLocalStorage,
    clearUserInfor,
  };
};

export default useAuth;
