import {AUTH} from '../config/app.config';

export class JwtService {
    static set(jwt: string) {
        sessionStorage.setItem(AUTH.GET_AUTH_KEY, jwt);
    }

    static get() {
        return sessionStorage.getItem(AUTH.GET_AUTH_KEY);
    }

    static remove() {
        sessionStorage.removeItem(AUTH.GET_AUTH_KEY);
    }
}
