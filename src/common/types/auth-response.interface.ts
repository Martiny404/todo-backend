import { JwtPayload } from '../classes/jwt-payload.class';
import { Tokens } from './tokens.interface';

export interface IAuthResponse extends Tokens {
  userInfo: JwtPayload;
}
