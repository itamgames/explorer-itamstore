import {ERROR_MSG} from '@/common/config/error.config';
import {SNS_CONFIG} from '@/common/config/env.config';

export class GoogleAuthService {

    static get Instance(): GoogleAuthService {
        return GoogleAuthService.instance;
    }
    private static instance: GoogleAuthService = new GoogleAuthService();
    private auth2: any;

    constructor() {
        if (GoogleAuthService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }
        GoogleAuthService.instance = this;
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            window.gapi.load('auth2', async () => {
                this.auth2 = await window.gapi.auth2.init({
                    client_id: SNS_CONFIG.GOOGLE_CLIENT_ID,
                });
                resolve();
            });
        });
    }

    async login(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const isLogin: boolean = await this.auth2.signIn();

                const user: any = this.auth2.currentUser.get();
                const basicProfile: any = user.getBasicProfile();

                if (isLogin) {
                    resolve({
                        userGroup: 'google',
                        snsUserId: basicProfile.getId(),
                        userEmail: basicProfile.getEmail(),
                        profileImages: [basicProfile.getImageUrl()],
                        snsAccessToken: user.getAuthResponse({fetch_basic_profile: false}).id_token,
                    });
                }
            } catch (e) {
                reject({code: 400, message: 'close popup', type: 'CLOSE_POPUP'});
            }

        });
    }

    logout(): Promise<any> {
        return this.auth2.signOut();
    }
}
