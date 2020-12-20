import {ERROR_MSG} from '@/common/config/error.config';
import {AXIOS} from '@/common/config/env.config';
import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import store from '@/store';

export class AccountAxiosService {

    static get Instance(): AccountAxiosService {
        return AccountAxiosService.instance;
    }
    private static instance: any = new AccountAxiosService();
    private axios: AxiosInstance;

    constructor() {

        if (AccountAxiosService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }

        this.axios = axios.create({
            baseURL: AXIOS.ACCOUNT_BASE_URL,
            timeout: AXIOS.TIMEOUT,
        });

        this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
            const language: string = store.state.locale === 'hans' ? 'zh-Hans' : store.state.locale;
            config.headers['Accept-Language'] = language;
            return config;
        }, (error: AxiosError) => {
            throw error;
        });

        this.axios.interceptors.response.use((response: AxiosResponse) => {
            return response.data;
        }, (error: AxiosError) => {
            if (error.response) {
                throw error.response.data.error;
            } else {
                throw error;
            }
        });

        AccountAxiosService.instance = this;
    }

    get(url: string, config?: any): Promise<any> {
        return this.axios.get(url, config);
    }

    post(url: string, data?: any, config?: any): Promise<any> {
        return this.axios.post(url, data, config);
    }

    put(url: string, data?: any, config?: any): Promise<any> {
        return this.axios.put(url, data, config);
    }
}
