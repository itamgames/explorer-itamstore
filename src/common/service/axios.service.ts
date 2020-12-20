import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {AXIOS} from '@/common/config/env.config';
import {AxiosInstance} from 'axios';
import {AUTH} from '@/common/config/app.config';

export class AxiosService {

    private headers: any = {
        'Accept': AXIOS.ACCEPT,
        'Content-type': AXIOS.CONTENT_TYPE,
    };

    private axios: AxiosInstance;

    constructor(baseURL) {
        this.axios = axios.create({
            baseURL,
            timeout: AXIOS.TIMEOUT,
        });

        this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers = Object.assign({
                Authorization: `Bearer ${sessionStorage.getItem(AUTH.GET_AUTH_KEY)}`,
            }, this.headers);
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

