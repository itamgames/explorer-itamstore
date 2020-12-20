import store from '@/store';
import {LANG} from '@/common/config/app.config';

export const getObjectLocale = (targetObject: any = {}) => {
    const {gameDefaultLocale} = store.getters;
    const locale: string = store.getters.locale === LANG.CHINESE_HANS ? 'zh-Hans' : store.getters.locale;
    let result = {};

    if (targetObject[locale]) {
        result = targetObject[locale];
    } else if (targetObject[gameDefaultLocale]) {
        result = targetObject[gameDefaultLocale];
    } else {
        result = targetObject[Object.keys(targetObject)[0]];
    }

    return result || {};
};
