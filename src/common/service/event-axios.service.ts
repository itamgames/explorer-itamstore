import {ERROR_MSG} from '@/common/config/error.config';
import {AXIOS} from '@/common/config/env.config';
import {AxiosService} from './axios.service';

export class EventAxiosService extends AxiosService {

    static get Instance(): EventAxiosService {
        return EventAxiosService.instance;
    }
    private static instance: any = new EventAxiosService();

    constructor() {
        if (EventAxiosService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }

        super(AXIOS.EVENT_BASE_URL);
        EventAxiosService.instance = this;
    }
}
