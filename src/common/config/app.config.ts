export enum ACHIEVEMENTS_TYPE {
    CLEAR = 'clear',
    YET = 'yet',
    SEAL = 'seal',
}

export enum RANK {
    DAILY = 'daily',
    WEEKLY = 'week',
    TOTAL = 'total',
    SCORE_TYPE_HIGH = 'high',
    SCORE_TYPE_LOW = 'low',
    SUMMARY_MAX_VIEW_NUM = 6,
}

export enum INTERVAL {
    ACHIEVEMENTS_RECORD = 10000,
}

export enum PAGINATION {
    SIZE = 10,
    MAX = 10,
}

export const LANG = require('../i18n/config.json');

export enum STORAGE {
    BOOKMARK = 'itam-storage-bookmark',
    RETRIEVED_ID = 'itam-storage-retrieved-id',
}

export enum PREVIEW {
    SIZE = 3,
}

export class ACCOUNT {
    static readonly CODE = 'itamitamitam';
    static readonly SCOPE = 'EOS';
    static readonly TABLE = 'accounts';
    static readonly GROUP = 'eos';
}

export enum AUTH {
    GET_AUTH_KEY = 'itam_backoffice_jwt',
}
