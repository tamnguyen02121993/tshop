import { apiEndpoints, http } from '.';
import { ILoginRequest, ILoginResponse } from '../interfaces/';

class AuthenticationService {
  static login(request: ILoginRequest) {
    return http.post<ILoginResponse>(apiEndpoints.accounts.login, request);
  }

  static revoke(name: string) {
    return http.post(apiEndpoints.accounts.revoke(name));
  }
}

export default AuthenticationService;
