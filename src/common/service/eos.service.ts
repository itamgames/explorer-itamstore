import {ERROR_MSG} from '@/common/config/error.config';
import {EOS} from '@/common/config/env.config';

export class EosService {
    private static instance: EosService = new EosService();
    eos: any = null;

    constructor() {
        if (EosService.instance) {
            throw new Error(ERROR_MSG.DONT_INSTANTIATION);
        }
        EosService.instance = this;
    }

    static get Instance(): EosService {
        return EosService.instance;
    }

    async initEOS() {
        const Eos: any = (await import('eosjs')).default;
        this.eos = new Eos(EOS.NETWORK);
    }

    async getTableRow(code: string, scope: string, table: string) {
        return this.eos.getTableRows({code, scope, table, json: true, limit: -1});
    }

    async getAccountInfo(account: string) {
        return this.eos.getAccount({account_name: account});
    }
}
