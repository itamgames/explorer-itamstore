import Vue from 'vue';
import Vuex, {Module} from 'vuex';
import {Balance, Resource, State} from '@/store/player/player.interface';
import {RootState} from '@/store/interface';
import {EosService} from '@/common/service/eos.service';
import {ERROR_MSG} from '@/common/config/error.config';
import {ACCOUNT} from '@/common/config/app.config';
import {MarketAxiosService} from '@/common/service/market-axios.service';

Vue.use(Vuex);

const store: Module<State, RootState> = {
    state: {
        info: null,
        userGroup: null,
        balance: {
            unstaked: {eos: 0, rate: 0},
            staked: {eos: 0, rate: 0},
            refund: {eos: 0, rate: 0},
        },
        resource: {
            cpu: {max: 0, used: 0, rate: 0, eos: 0},
            bandwidth: {max: 0, used: 0, rate: 0, eos: 0},
            ram: {max: 0, used: 0, rate: 0, eos: 0},
        },
        token: '0.0000',
        achievements: [],
        rank: {},
        totalScore: 0,
        digitalAssets: null,
        nicknames: null,
    },
    actions: {
        async getPlayerInfo({commit, dispatch}, accountName) {
            const params = {userId: accountName.trim()};
            const player: any = await MarketAxiosService.Instance.get('get-player-info', {params});

            if (player) {
                commit('setInfo', player);
                commit('setUserGroup', player.games[0].userGroup);
            } else {
                dispatch('openNotSearchModal');
                throw new Error(ERROR_MSG.NOT_FOUND_ACCOUNT);
            }

        },
        async getEOSInfo({commit, dispatch}, {userId, userGroup}: any) {
            if (userGroup === 'eos') {
                dispatch('getEOSUserInfo', {userId});
            } else {
                dispatch('getCenterAccountUserInfo', {userId});
            }
        },
        async getCenterAccountUserInfo({commit, dispatch}, {userId}: any) {
            if (!EosService.Instance.eos) {
                await EosService.Instance.initEOS();
            }

            const eos = EosService.Instance;

            let info: any;
            try {
                info = await eos.getTableRow(ACCOUNT.CODE, ACCOUNT.SCOPE, ACCOUNT.TABLE);
            } catch (e) {
                dispatch('openNotSearchModal');
                throw new Error(ERROR_MSG.NOT_FOUND_ACCOUNT);
            }

            const result: any = info.rows.find((row: any) => row.owner === userId);
            commit('setToken', result ? result.balance.replace(' EOS', '') : '0.0000');
        },
        async getEOSUserInfo({commit, dispatch}, {userId}: any) {
            if (!EosService.Instance.eos) {
                await EosService.Instance.initEOS();
            }

            const eos = EosService.Instance;

            let info: any;
            try {
                info = await eos.getAccountInfo(userId);
            } catch (e) {
                dispatch('openNotSearchModal');
                throw new Error(ERROR_MSG.NOT_FOUND_ACCOUNT);
            }

            const refundReq = info.refund_request;
            const totalResources = info.total_resources || {};
            const unstaked = info.core_liquid_balance ? Number(info.core_liquid_balance.replace('EOS', '')) : 0;
            const staked = info.voter_info ? info.voter_info.staked / 10000 : 0;

            let refund = 0;
            if (refundReq) {
                refund = Number(refundReq.net_amount.replace('EOS', '')) +
                    Number(refundReq.cpu_amount.replace('EOS', ''));
            }

            const total = Number((refund + unstaked + staked).toFixed(4));

            const balance = {
                staked: {
                    eos: staked,
                    rate: staked / total * 100,
                },
                unstaked: {
                    eos: unstaked,
                    rate: unstaked / total * 100,
                },
                refund: {
                    eos: refund,
                    rate: refund / total * 100,
                },
            };
            const resource = {
                cpu: {
                    max: info.cpu_limit.max,
                    used: info.cpu_limit.used,
                    rate: Math.round(info.cpu_limit.used / info.cpu_limit.max * 100),
                    eos: totalResources.cpu_weight || '0.0000 EOS',
                },
                bandwidth: {
                    max: info.net_limit.max,
                    used: info.net_limit.used,
                    rate: Math.round(info.net_limit.used / info.net_limit.max * 100),
                    eos: totalResources.net_weight || '0.0000 EOS',
                },
                ram: {
                    max: info.ram_quota,
                    used: info.ram_usage,
                    rate: Math.round(info.ram_usage / info.ram_quota * 100),
                },
            };

            commit('setBalance', balance);
            commit('setResource', resource);
        },
        async getPlayerAchievements({commit, getters, dispatch}, {userId, appId}: any) {
            const params = {userId, appId};
            const list: any[] = await MarketAxiosService.Instance.get('get-player-achievements', {params});
            const result: any = {};
            let totalScore: number = 0;

            list.forEach((item: any) => {
                if (getters.achievements) {
                    const index: number = getters.achievements.findIndex((o: any) => {
                        return o._id === item.achievementId;
                    });
                    const achievement = getters.achievements[index];

                    if (achievement && achievement.achievementPerStep === item.histories.length) {
                        totalScore += achievement.achievementScore;
                    }

                    result[item.achievementId] = item;
                }
            });

            commit('setAchievements', result);
            commit('setTotalScore', totalScore);
        },
        async getPlayerRank({commit}, {userId, appId, boardId, scoreType, type}: any) {
            const params = {userId, appId, boardId, scoreType};
            const result: any = await MarketAxiosService.Instance.get(`get-player-${type}-rank`, {params});

            commit('setLeaderboard', result);
        },
        async getPlayerDigitalAssets(
            {commit},
            {appId, player, categoryId, page = 1}: {appId: string, player: string, categoryId?: string, page: number},
        ) {

            const params: any = {player, appId, page};
            if (categoryId) { params.categoryId = categoryId; }
            const result: any = await MarketAxiosService.Instance.get(`player-digital-assets`, {params});

            commit('setPlayerDigitalAssets', result);
        },
        async getPlayerNicknamesFromAssets({commit}, {appId, userId}: {appId: string, userId: string}) {
            const params: any = {appId, userId};
            const result: any = await MarketAxiosService.Instance.get('player-nicknames', {params});
            commit('setNicknames', result);
        },
    },
    getters: {
        playerInfo: (state: any) => state.info,
        userGroup: (state: any) => state.userGroup,
        balance: (state: any) => state.balance,
        resource: (state: any) => state.resource,
        playerToken: (state: any) => state.token,
        playerAchievements: (state: any) => state.achievements,
        playerRank: (state: any) => state.rank,
        totalScore: (state: any) => state.totalScore,
        playerDigitalAssets: (state: any) => state.digitalAssets,
        playerNicknames: (state: any) => state.nicknames,
    },
    mutations: {
        setInfo(state: State, info: any) {
            state.info = info;
        },
        setUserGroup(state: State, userGroup: string) {
            state.userGroup = userGroup;
        },
        setBalance(state: State, balance: Balance) {
            state.balance = balance;
        },
        setResource(state: State, resource: Resource) {
            state.resource = resource;
        },
        setToken(state: State, token: string) {
            state.token = token;
        },
        setAchievements(state: State, achievements: any[]) {
            state.achievements = achievements;
        },
        setLeaderboard(state: State, rank: any) {
            state.rank = rank;
        },
        setTotalScore(state: State, totalScore: number) {
            state.totalScore = totalScore;
        },
        setPlayerDigitalAssets(state: State, digitalAssets: any) {
            state.digitalAssets = digitalAssets;
        },
        setNicknames(state: State, nicknames: any) {
            state.nicknames = nicknames;
        },
    },
};

export default store;

