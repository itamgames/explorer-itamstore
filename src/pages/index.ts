import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import home from '@/pages/home/home.router';
import signup from '@/pages/sign/signup.router';
import game from '@/pages/game/game.router';
import player from '@/pages/player/player.router';
import store from '@/store/index.ts';
import error from '@/pages/error/error.router';
import maintenance from '@/pages/maintenance/maintenance.router';
// import referral from '@/pages/event/referral/referral.router';
import privacyPolicy from '@/pages/sign/privacy-policy.router';
import {LANG} from '@/common/config/app.config';

Vue.use(Router);

const router: any = new Router({
    mode: 'history',
    base: process.env.MARKET_BASE_URL,
    routes: [{
        path: '/:lang',
        name: 'i18n',
        component: index,
        children: [
            ...maintenance,
            // ...home,
            // ...signup,
            // ...game,
            // ...player,
            // ...referral,
            // ...privacyPolicy,
            // ...error,
        ],
    }],
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
});


router.beforeEach(async (to: any, from: any, next: any) => {
    const toLang = to.params.lang;
    const fromLang = from.params.lang;

    // 언어 설정이 되지 않은 경우
    if (!toLang) {
        _initLocale();
        next(`/${store.getters.locale}`);
        return;
    }


    if (from.name === 'additional') {
        store.commit('setAdditional', {userGroup: 'itam'});
    }

    // 지원하지 않는 언어로 진입하는 경우
    if (!Object.keys(LANG).find((key: string) => LANG[key] === toLang)) {
        _initLocale();
        to.params.lang = store.getters.locale;
        const path: string = to.fullPath.replace(toLang, store.getters.locale);
        next(path);
        return;
    }

    // 언어 설정을 변경한 경우
    if (toLang !== fromLang) {
        _changeLocale();
    }

    // 검색한 계정의 게임이 지정되지 않았을경우.
    if (to.name === 'player') {
        await _setPlayerGame();
        return;
    }

    next();

    function _initLocale() {
        store.dispatch('initLocale');
    }

    function _changeLocale() {
        store.dispatch('switchLanguage', to.params.lang);
    }

    async function _setPlayerGame() {
        try {
            await store.dispatch('getPlayerInfo', to.params.id);
            const gameId: string = store.getters.playerInfo.games[0].appId;
            next({name: 'player-game', params: Object.assign(to.params, {game: gameId})});
        } catch (e) {
            next(false);
        }
    }
});



export default router;
