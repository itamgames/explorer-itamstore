enum MAIN_NET {
    httpEndpoint = 'https://api.eoseoul.io',
    chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
}

enum KYLIN_NET {
    httpEndpoint = 'https://kylin.eoscanada.com',
    chainId = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
}

export enum SNS_CONFIG {
    GOOGLE_CLIENT_ID = '191433779581-hm49j4fp4o67v3ckup8sv96817nv2j73.apps.googleusercontent.com',
    FACEBOOK_APP_ID = '411166203002903',
    KAKAO_APP_ID = '01d9fefb87c8bb116e6e33b7f265df1e',
}

export class EOS {
    static readonly NETWORK = process.env.NODE_ENV === 'production' ? MAIN_NET : MAIN_NET;
    static readonly NET = process.env.NODE_ENV === 'production' ? 1 : 1;
}

export const NETWORKS = {
    httpEndpoint: 'https://api-kylin.eosasia.one',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
};


export class AXIOS {
    static readonly MARKET_BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://api.itam.games/gg/v1' :
        'https://dev-api.itam.games/gg/v1';
    static readonly ACCOUNT_BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://api.itam.games/itam/v2' :
        'https://dev-api.itam.store/itam/v2';
    static readonly COMMON_BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://api.itam.games/common/v2' :
        'https://dev-api.itam.store/common/v2';
    static readonly EVENT_BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://api.itam.games/mobile-event/v1' :
        'https://dev-api.itam.games/mobile-event/v1';
    static readonly MOBILE_URL = process.env.NODE_ENV === 'production' ?
        'https://api.itam.games/mobile-app/v1' :
        'https://dev-api.itam.games/mobile-app/v1';
    static readonly ACCEPT = 'application/json';
    static readonly CONTENT_TYPE = 'application/json;charset=utf-8';
    static readonly TIMEOUT = 100000;
}

export class RESOURCE {
    static readonly BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://assets.itam.games' :
        'https://dev-assets.itam.games';
}


export class REFERRAL {
    static readonly BASE_URL = process.env.NODE_ENV === 'production' ?
        'https://itam.market' :
        'https://test.itam.market';
}
