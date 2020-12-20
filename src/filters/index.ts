import Vue from 'vue';
import {formatDate} from '@/common/util/date.util';
import {LANG} from '@/common/config/app.config';
import {RESOURCE} from '@/common/config/env.config';
import store from '@/store/index.ts';
import {getObjectLocale} from '@/common/util/locale.util';

Vue.filter('convertDateFormat', (date: string) => {
    return formatDate(new Date(date), true);
});

Vue.filter('locale', (locale: string) => {
    switch (locale) {
        case LANG.KOREA: return '한국어'; break;
        case LANG.ENGLISH: return 'ENGLISH'; break;
        case LANG.CHINESE_HANS: return '简体中文'; break;
    }
});

Vue.filter('percentage', (value: number, total: number) => {
    const percentage: number = Math.round(value / total * 100);
    return `${isNaN(percentage) ? 0 : percentage}%`;
});

Vue.filter('eos', (value: number) => {
    return value.toFixed(4);
});

Vue.filter('kilobyte', (byte: number) => {
    return Math.round(byte / 1024);
});

Vue.filter('millisecond', (us: number) => {
    return Math.round(us / 1000);
});

Vue.filter('enter', (text: string) => {
    return text.replace(/\n/g, '<br/>');
});

Vue.filter('appendURL', (path: string) => {
    return `${RESOURCE.BASE_URL}${path}?time=${Date.now()}`;
});

Vue.filter('gameIcon', (game: string) => {
    const {gameList} = store.getters;
    const selectedGame: any = getObjectLocale(gameList[game].storeInfo.baseAppDetailInfo);

    return selectedGame.icon;
});

Vue.filter('gameTitle', (game: string) => {
    const {gameList} = store.getters;
    const gameInfo = gameList[game];

    if (gameInfo) {
        const selectedGame: any = getObjectLocale(gameInfo.storeInfo.baseAppDetailInfo);
        return selectedGame.title;
    } else {
        return '';
    }
});

Vue.filter('newsTitle', (news: any) => {
    const newsInfo: any = getObjectLocale(news);
    return newsInfo.title;
});

Vue.filter('newsTitle', (news: any) => {
    const newsInfo: any = getObjectLocale(news);
    return newsInfo.title;
});

Vue.filter('gameService', (service: any) => {
    return getObjectLocale(service);
});

Vue.filter('digitalAssetsCategoryName', (category: any) => {
    const categoryInfo: any = getObjectLocale(category);
    return categoryInfo.name;
});

Vue.filter('digitalAssetsGroup', (group: any) => {
    return getObjectLocale(group);
});

Vue.filter('leaderboardScoreType', (score: number = 0, leaderboard: any) => {
    switch (leaderboard.scoreUnit) {
        case 'num' :
            return `${score}`;
            break;
        case 'time' :
            let msec: number | string = score;
            let sec: number | string = 0;
            let min: number | string = 0;
            let hour: number | string = 0;

            if (msec >= 1000) {
                sec = Math.floor(msec / 1000);
                msec = msec - sec * 1000;
            }
            if (sec >= 60) {
                min = Math.floor(sec / 60);
                sec = sec - min * 60;
            }
            if (min >= 60) {
                hour = Math.floor(min / 60);
                min = min - hour * 60;
            }

            hour = hour >= 10 ? hour : '0' + hour;
            min = min >= 10 ? min : '0' + min;
            sec = sec >= 10 ? sec : '0' + sec;
            msec = msec.toString().length >= 3 ? msec.toString().substr(0, 3) : msec + '00';

            return `${hour}:${min}:${sec}.${msec}`;
            break;
        case 'currency' :
            return `${leaderboard.unitType}${score}`;
            break;
        default : return score;
    }

});

Vue.filter('formatNumber', (num: number) => {
        return num < 10 ? `0${num}` : num;
});
