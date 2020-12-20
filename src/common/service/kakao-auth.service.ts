import {ERROR_MSG} from '@/common/config/error.config';
import {SNS_CONFIG} from '@/common/config/env.config';
import {SnsMember} from '@/index';

export class KakaoAuthService {

    static get Instance(): KakaoAuthService {
        return KakaoAuthService.instance;
    }
    private static instance: KakaoAuthService = new KakaoAuthService();
    private kakao: any;

    constructor() {
        if (KakaoAuthService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }
        KakaoAuthService.instance = this;
    }

    init() {
        this.kakao = window.Kakao;
        this.kakao.init(SNS_CONFIG.KAKAO_APP_ID);
    }

    async login(): Promise<SnsMember> {
        return new Promise((resolve, reject) => {
            this.kakao.Auth.login({
                success: async (auth: any) => {
                    this.kakao.API.request({
                        url: '/v2/user/me',
                        success(response) {
                            resolve({
                                userGroup: 'kakao',
                                userEmail: response.kakao_account.email,
                                snsUserId: response.id.toString(),
                                snsAccessToken: auth.access_token,
                                profileImages: [response.properties.profile_image],
                            });
                        },
                        fail(error) {
                            reject(error);
                        },
                    });
                },
                fail(error) {
                    if (error.error === 'window_closed') {
                        reject({code: 400, message: 'close popup', type: 'CLOSE_POPUP'});
                    } else {
                        reject(error);
                    }
                },
            });
        });
    }

    logout(): Promise<any> {
        return this.kakao.logout();
    }
}
