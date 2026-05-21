import {
  MOBILE_APP_CLIENT_HEADER,
  MOBILE_APP_CLIENT_VALUE,
} from '../../config/appClient';
import { postJson } from './http';

export async function authGoogle(idToken: string) {
  return postJson('/auth/google', { idToken }, {
    [MOBILE_APP_CLIENT_HEADER]: MOBILE_APP_CLIENT_VALUE,
  });
}
