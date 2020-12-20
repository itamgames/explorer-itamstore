import Vue from 'vue';
import Vuex, { Module } from 'vuex';
import {
    AchievementsList,
    Category, DigitalAssets,
    DigitalAssetsCategory,
    DigitalAssetsGroup,
    Game,
    GameList,
    LeaderboardList,
    Notice,
    Notices,
    Params,
    State,
} from './game.interface';
import { RootState } from '@/store/interface';
import { MarketAxiosService } from '@/common/service/market-axios.service';
import router from '@/pages/index.ts';
import { RANK } from '@/common/config/app.config';

Vue.use(Vuex);

const store: Module<State, RootState> = {
    state: {
        selectedGame: null,
        gameCategory: {},
        gameList: null,
        leaderboardCategory: [],
        achievements: null,
        gameRankList: null,
        notices: null,
        selectedNotice: null,
        gameDefaultLocale: '',
        symbol: '',
        digitalAssetsCategorys: null,
        digitalAssetsGroups: null,
        digitalAssets: null,
    },
    actions: {
        async getGameList({commit}) {
            const list: Game[] = await MarketAxiosService.Instance.get('get-game-list');
            const gameList: GameList = {};
            list.forEach((item: Game) => {
                gameList[item._id] = item;
            });
            commit('setGameList', gameList);
        },
        async getGameCategoryList({commit}) {
            const categoryList: any[] = await MarketAxiosService.Instance.get('get-game-category-list');
            const category: any = {};

            categoryList.forEach((item: any) => {
                category[item._id] = item.categoryKey;
            });

            commit('setGameCategory', category);
        },
        async getGameNotice({commit}, noticeId: string) {
            const params = {_id: noticeId};
            const result: any = await MarketAxiosService.Instance.get('get-game-notice', {params});
            commit('setSelectedNotice', result);
        },
        async getGameNotices({commit}, params: Params) {
            const result: any = await MarketAxiosService.Instance.get('get-game-notice-list', {params});
            commit('setNotices', result);
        },
        async getGameServiceInfo({commit}, appId: string) {
            const params = {appId};
            const result: any = await MarketAxiosService.Instance.get('get-game-service-info', {params});

            if (result && result.appId) {
                commit('setAchievementsList', result.achievementList);
                commit('setLeaderboardCategory', result.leaderBoardList);
            } else {
                commit('setAchievementsList', null);
                commit('setLeaderboardCategory', null);
            }
        },
        selectNotice({commit, getters}, noticeId: string) {
            const index = getters.notices.list.findIndex((notice: Notice) => notice._id === noticeId);
            commit('setSelectedNotice', getters.notices[index]);
        },
        selectGame({commit, getters, state}, appId: string) {
            let game: any = state.gameList!;
            let selectedGame: any = game[appId];
            let baseAppLanguage: any;

            if (selectedGame) {
                selectedGame = selectedGame.storeInfo;
                baseAppLanguage = selectedGame.baseAppLanguage;

                if (selectedGame.baseAppDetailInfo[getters.locale]) {
                    game = selectedGame.baseAppDetailInfo[getters.locale];
                } else {
                    game = selectedGame.baseAppDetailInfo[baseAppLanguage];
                }

                game.appId = appId;
            } else {
                selectedGame = null;
                baseAppLanguage = null;
                router.push({name: 'error'});
            }

            commit('setGameDefaultLocale', baseAppLanguage);
            commit('setSelectedGame', game);
        },
        async getGameRankList(
            {commit, dispatch},
            {appId, boardId, scoreType, page = 1, type = RANK.TOTAL}: {
                appId: string;
                boardId: string;
                scoreType: string;
                page: number;
                type: RANK.DAILY | RANK.WEEKLY | RANK.TOTAL;
            }) {
            const params: any = {appId, boardId, scoreType, page};
            const result: any = await MarketAxiosService.Instance.get(`get-game-${type}-rank-list`, {params});
            result.list.map((item: any, index: number) => {
                if (index) {
                    const prevRank: number = result.list[index - 1].rank;
                    item.rank = result.list[index - 1].score === item.score ? prevRank : prevRank + 1;
                } else {
                    item.rank = result.pageFirstRank;
                }
                return item;
            });
            commit('setRankList', result);
        },
        async searchPlayerRank(
            {commit, dispatch},
            {userId, appId, boardId, scoreType, type}: {
                userId: string;
                appId: string;
                boardId: string;
                scoreType: string;
                type: RANK.DAILY | RANK.WEEKLY | RANK.TOTAL;
            },
        ) {
            const params = {userId, appId, boardId, scoreType};
            const result: any = await MarketAxiosService.Instance.get(`get-player-${type}-rank`, {params});
            let playerRank: any;

            if (result) {
                playerRank = {list: [result], total: result.length};
            } else {
                playerRank = {list: [], total: 0};
            }

            commit('setRankList', playerRank);
        },
        async getDigitalAssetsCategorys({commit}, {appId}: { appId: string }) {
            const params = {appId};
            const list: DigitalAssetsCategory[] =
                await MarketAxiosService.Instance.get('game-digital-assets-categorys', {params});

            if (list.length) {
                const symbol: string = list[0].symbol;
                commit('setGameSymbol', symbol);
                commit('setDigitalAssetsCategorys', list);
            } else {
                commit('setGameSymbol', null);
                commit('setDigitalAssetsCategorys', null);
            }
        },
        async getDigitalAssetsGroups(
            {commit},
            {appId, categoryId}: { appId: string, categoryId?: string },
        ) {

            const params: any = {appId};
            if (categoryId) {
                params.categoryId = categoryId;
            }

            const list: DigitalAssetsGroup[] =
                await MarketAxiosService.Instance.get('game-digital-assets-groups', {params});

            commit('setDigitalAssetsGroups', list);
        },
        async getDigitalAssets(
            {commit},
            {appId, categoryId, keyword, page = 1}: {
                appId: string;
                categoryId?: string;
                keyword?: string;
                page: number;
            },
        ) {

            const params: any = {appId, page};
            if (categoryId) {
                params.categoryId = categoryId;
            }
            if (keyword) {
                params.keyword = keyword;
            }

            const list: DigitalAssetsGroup[] =
                await MarketAxiosService.Instance.get('game-digital-assets', {params});

            commit('setDigitalAssets', list);
        },
    },
    getters: {
        gameList: (state: State) => state.gameList,
        gameCategory: (state: State) => state.gameCategory,
        notices: (state: State) => state.notices,
        selectedNotice: (state: State) => state.selectedNotice,
        achievements: (state: State) => state.achievements,
        gameRankList: (state: State) => state.gameRankList,
        leaderboardCategory: (state: State) => state.leaderboardCategory,
        selectedGame: (state: State) => state.selectedGame,
        gameDefaultLocale: (state: State) => state.gameDefaultLocale,
        symbol: (state: State) => state.symbol,
        digitalAssetsCategorys: (state: State) => state.digitalAssetsCategorys,
        digitalAssetsGroups: (state: State) => state.digitalAssetsGroups,
        digitalAssets: (state: State) => state.digitalAssets,
    },
    mutations: {
        setGameList(state: State, gameList: GameList) {
            state.gameList = gameList;
        },
        setGameCategory(state: State, category: Category) {
            state.gameCategory = category;
        },
        setNotices(state: State, notices: Notices) {
            state.notices = notices;
        },
        setSelectedNotice(state: State, notice: Notice) {
            state.selectedNotice = notice;
        },
        setAchievementsList(state: State, achievements: AchievementsList) {
            state.achievements = achievements;
        },
        setRankList(state: State, gameRankList: LeaderboardList) {
            state.gameRankList = gameRankList;
        },
        setLeaderboardCategory(state: State, leaderboardCategory: string[]) {
            state.leaderboardCategory = leaderboardCategory;
        },
        setSelectedGame(state: State, game: any) {
            state.selectedGame = game;
        },
        setGameDefaultLocale(state: State, locale: string) {
            state.gameDefaultLocale = locale;
        },
        setGameSymbol(state: State, symbol: string) {
            state.symbol = symbol;
        },
        setDigitalAssetsCategorys(state: State, digitalAssetsCategorys: DigitalAssetsCategory[]) {
            state.digitalAssetsCategorys = digitalAssetsCategorys;
        },
        setDigitalAssetsGroups(state: State, digitalAssetsGroups: DigitalAssetsGroup[]) {
            state.digitalAssetsGroups = digitalAssetsGroups;
        },
        setDigitalAssets(state: State, digitalAssets: DigitalAssets[]) {
            state.digitalAssets = digitalAssets;
        },
    },
};

export default store;

