import { ITokenResponse } from '.';

export interface ILoginResponse extends ITokenResponse {
  issuer: string;
  audience: string;
  name: string;
}
