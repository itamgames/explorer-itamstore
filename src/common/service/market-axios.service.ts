
import {ERROR_MSG} from '@/common/config/error.config';
import {AXIOS} from '@/common/config/env.config';
import {AxiosService} from './axios.service';

export class MarketAxiosService extends AxiosService {

    static get Instance(): MarketAxiosService {
        return MarketAxiosService.instance;
    }
    private static instance: any = new MarketAxiosService();

    constructor() {
        if (MarketAxiosService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }

        super(AXIOS.MARKET_BASE_URL);
        MarketAxiosService.instance = this;
    }
}
