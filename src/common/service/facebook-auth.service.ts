import {ERROR_MSG} from '@/common/config/error.config';
import {SNS_CONFIG} from '@/common/config/env.config';
import axios from 'axios';
import {SnsMember} from '@/index';

export class FacebookAuthService {

    static get Instance(): FacebookAuthService {
        return FacebookAuthService.instance;
    }
    private static instance: FacebookAuthService = new FacebookAuthService();
    private facebook: any;

    constructor() {
        if (FacebookAuthService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }

        FacebookAuthService.instance = this;
    }

    init() {
        this.facebook = window.FB;
        return this.facebook.init({
            appId            : SNS_CONFIG.FACEBOOK_APP_ID,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.3',
        });
    }

    async login(): Promise<SnsMember> {
        return new Promise((resolve, reject) => {
            this.facebook.login(async (response) => {
                if (response.status === 'connected') {
                    const {accessToken, userID} = response.authResponse;
                    const userInfo: any = await axios.get(
                        `https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${accessToken}`,
                    );
                    const {email} = userInfo.data;
                    resolve({
                        userGroup: 'facebook',
                        snsAccessToken: accessToken,
                        snsUserId: userID,
                        userEmail: email,
                    });
                } else {
                    reject({code: 400, message: 'close popup', type: 'CLOSE_POPUP'});
                }
            }, {scope: 'public_profile,email', return_scopes : true});
        });

    }

    logout(): Promise<any> {
        return this.facebook.logout();
    }
}
