import { ILoginResponse } from '.';

export interface IUserInfo extends ILoginResponse {
  isAuthenticated: boolean;
}
