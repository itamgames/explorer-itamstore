import Vue from 'vue';
import Vuex, { Module } from 'vuex';
import { RootState } from '@/store/interface';
import { EventAxiosService } from '@/common/service/event-axios.service';
import { AccountAxiosService } from '@/common/service/account-axios.service';
import { JwtService } from '@/common/service/jwt.service';

Vue.use(Vuex);

const store: Module<any, RootState> = {
    state: {
        referralInfo: {},
        userInfo: {},
        additional: {},
        facebookLoaded: false,
        googleLoaded: false,
    },
    actions: {
        async initUser({commit, dispatch}, user) {
            JwtService.set(user.token);
            commit('setUserInfo', user);
            await dispatch('getUserReferralInfo');
        },
        async socialLogin({commit, dispatch}, {snsUserId, snsAccessToken, userGroup}) {
            const user: any = await AccountAxiosService.Instance.post(
                `sign/sns-sign-in`,
                {
                    snsUserId,
                    snsAccessToken,
                    sns: userGroup,
                },
            );

            await dispatch('initUser', {token: user.token, userGroup});
        },
        async itamLogin({commit, dispatch}, {userEmail, password}) {
            const user: any = await AccountAxiosService.Instance.post(
                '/sign/itam-sign-in',
                {userEmail, password},
            );

            await dispatch('initUser', {token: user.token, userGroup: 'eos'});
        },
        async getUserReferralInfo({commit}) {
            const result: any = await EventAxiosService.Instance.post('get-my-referral-info');
            if (result) {
                commit('setReferralInfo', result);
                commit('setUserInfo', {userId: result.userId, userEmail: result.email});
            }
        },
        async logout({commit}) {
            JwtService.remove();
            commit('setUserInfo', {});
            commit('setReferralInfo', {});
        },
    },
    getters: {
        userInfo: (state) => state.userInfo,
        additional: (state) => state.additional,
        referralInfo: (state) => state.referralInfo.referralInfo,
        referralCount: (state) => state.referralInfo.referralInfo ? state.referralInfo.referralInfo.childrenCount : 0,
        referralBonus: (state) => state.referralInfo ? state.referralInfo.referralBonus : '0.0000',
        referralRank: (state) => state.referralInfo.myRank ? state.referralInfo.myRank : '-',
        referralList: (state) => state.referralInfo.referralInfo ? state.referralInfo.referralInfo.children : [],
        googleLoaded: (state) => state.googleLoaded,
        facebookLoaded: (state) => state.facebookLoaded,
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setReferralInfo(state, referralInfo) {
            state.referralInfo = referralInfo;
        },
        setAdditional(state, additional) {
            state.additional = additional;
        },
        facebookLoaded(state) {
            state.facebookLoaded = true;
        },
        googleLoaded(state) {
            state.googleLoaded = true;
        },
    },
};

export default store;
