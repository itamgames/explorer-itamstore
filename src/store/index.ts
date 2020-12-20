import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import account from './account/account.store';
import player from './player/player.store';
import search from './search/search.store';
import game from './game/game.store';
import {RootState} from '@/store/interface';
import i18n from '@/common/i18n';
import {LANG} from '@/common/config/app.config';

Vue.use(Vuex);

const rootStore: StoreOptions<RootState> = {
    state: {
        locales: Object.keys(LANG).map((lang: string) => LANG[lang]),
        locale: 'en',
        showNotSearchModal: false,
        showLoadingDim: false,
        showLoginModal: false,
        showFindpassModal: false,
        showUserInfoModal: false,
        routeTransition: 'side',
        isPKGDownload: false,
        gtmEvent: '',
        downloadUrl: 'https://assets-store.itam.games/android/production/itamstore.apk',
    },
    modules: {
        player,
        search,
        game,
        account,
    },
    actions: {
        initLocale({dispatch}) {
            const userLang: string | any = navigator.language.split('-').shift();
            dispatch('switchLanguage', userLang);
        },
        switchLanguage({commit}, locale: string) {
            i18n.locale = locale;
            commit('setLanguage', locale);
        },
        openNotSearchModal({commit}) {
            commit('setShowNotSearchModal', true);
        },
        closeNotSearchModal({commit}) {
            commit('setShowNotSearchModal', false);
        },
        showLoadingDim({commit}) {
            commit('setShowLoadingDim', true);
        },
        hideLoadingDim({commit}) {
            commit('setShowLoadingDim', false);
        },
        sendGTM({commit, state} ) {
            window.dataLayer.push({ event: state.gtmEvent });
        },
        openNotLoginModal({commit}, is: boolean) {
            commit('setLoginModal', is);
        },
        openNotFindpassModal({commit}, is: boolean) {
            commit('setFindpassModal', is);
        },
        openNotUserInfoModal({commit}, is: boolean) {
            commit('setUserInfoModal', is);
        },
    },
    getters: {
        locale: (state: any) => state.locale,
        locales: (state: any) => state.locales,
        showNotSearchModal: (state: any) => state.showNotSearchModal,
        showLoadingDim: (state: any) => state.showLoadingDim,
    },
    mutations: {
        setGTMEvent(state, name) {
            state.gtmEvent = name;
        },
        setLanguage(state: any, locale: string) {
            state.locale = locale;
        },
        setShowNotSearchModal(state: any, showNotSearchModal: string) {
            state.showNotSearchModal = showNotSearchModal;
        },
        setShowLoadingDim(state: any, showLoadingDim: string) {
            state.showLoadingDim = showLoadingDim;
        },
        /** 로그인 모달 */
        setLoginModal(state: any, is: boolean) {
            state.showLoginModal = is;
        },
        /** 비밀번호 찾기 모달 */
        setFindpassModal(state: any, is: boolean) {
            state.showFindpassModal = is;
        },
        /** 사용자정보 모달 */
        setUserInfoModal(state: any, is: boolean) {
            state.showUserInfoModal = is;
        },
        /** APK download 모달 */
        setPKGDownloadModal(state: any, is: boolean) {
            state.isPKGDownload = is;
        },
    },
};

export default new Vuex.Store(rootStore);
