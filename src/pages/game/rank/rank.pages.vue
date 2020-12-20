<template>
    <div class="games box">
        <div class="row title-locale">
            <div class="DH20"></div>
            <h3>{{$t('player.leaderBoard')}}</h3>
        </div>

        <div class="select-board row">
            <div class="fL selected">
                <div class="select typeB" v-show="leaderboardCategory && leaderboardCategory.length && selectedLeaderboard">
                    <h5 class="row">
                        <span><b>{{selectedLeaderboard.name}}</b>({{selectedLeaderboard.type}})</span>
                        <i class="icon icon-play-down"></i>
                    </h5>
                    <ul class="select-list">
                        <li v-for="item in leaderboardCategory">
                            <button type="button" class="js-select-btn" @click="selectLeaderboard(item)">
                            <span>
                                <b>{{$options.filters.gameService(item.leaderBoardInfo).name }}</b>
                                ({{$t('rank')[item.calculatorType]}})</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fR">
                <div class="form-radio">
                    <label>
                        <input type="radio"
                               id="today"
                               name="range"
                               value="daily"
                               v-model="rankSchedule"
                               @change="changeSchedule"/> <span>{{$t('rank.today')}}</span>
                        <div class="tooltip">{{$t('rank.tooltip_day')}}</div>
                    </label>
                    <label>
                        <input type="radio"
                               id="week"
                               name="range"
                               value="week"
                               v-model="rankSchedule"
                               @change="changeSchedule"/> <span>{{$t('rank.weekly')}}</span>
                        <div class="tooltip">{{$t('rank.tooltip_week')}}</div>
                    </label>
                    <label>
                        <input type="radio"
                               id="all"
                               name="range"
                               value="total"
                               v-model="rankSchedule"
                               @change="changeSchedule"/> <span>{{$t('rank.total')}}</span>
                        <div class="tooltip">{{$t('rank.tooltip_day')}}</div>
                    </label>
                </div>
            </div>
        </div>

        <div class="tbl sub">
            <table @mouseleave="showPopup = false">
                <colgroup>
                    <col style="width: 80px" />
                    <col />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                </colgroup>
                <thead>
                <tr>
                    <th>
                        <span class="tit">{{$t('table.numbering')}}</span>
                    </th>
                    <th>
                        <div class="align-left">
                            <span class="tit">Player</span>
                        </div>
                    </th>
                    <th>
                        <span class="tit">{{$t('rank.record')}}</span>
                    </th>
                    <th>
                        <span class="tit">History</span>
                    </th>
                </tr>
                </thead>
                <tbody v-if="gameRankList && gameRankList.list.length" class="rank-list">
                    <tr v-for="(player, index) in gameRankList.list">
                        <th>
                            {{player.rank}}
                        </th>
                        <td class="align-left">
                            <router-link :to="{
                                name: 'player-game',
                                params: {id: player.userId, game: $route.params.game}}">
                                {{player.userId}}
                            </router-link>
                            <span class="nick" v-if="player.nickname && player.nickname !== ''">{{ player.nickname }}</span>
                        </td>
                        <td>
                            {{player.score | leaderboardScoreType(selectedLeaderboard)}}
                            <span v-if="selectedLeaderboard.scoreUnit === 'num'">
                                {{selectedLeaderboard.postFix ? selectedLeaderboard.postFix : $t('rank.score')}}
                            </span>
                        </td>
                        <td>
                             <span class="underline"
                                   @mouseenter="showHistoryPopup($event, player)">
                                {{$t('rank.recordViewing')}}
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="4" class="empty-box">
                            {{$t('empty.leaderboard')}}
                        </td>
                    </tr>
                </tbody>
                <popup v-show="showPopup" :data="popupData" :position="popupPosition"/>
            </table>
        </div>
        <div class="pagination2">
            <pagination :total="(gameRankList && gameRankList.total) ? gameRankList.total : 1"
                        :page="page"
                        @change-page="changePage"/>
            <div class="search-box">
                <input type="text" class="search-box__input"
                       @keyup.enter="search"
                       :placeholder="$t('home.search')" v-model="player"/>
                <button type="button" class="btn js-search" @click="search">
                    <i class="icon icon-search"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';
import {RANK} from '@/common/config/app.config';
import popup from '@/components/popup.component.vue';
import {getObjectLocale} from '../../../common/util/locale.util';

@Component({
    components: {
        pagination,
        popup,
    },
    computed: {
        ...mapGetters([
            'locale',
            'playerInfo',
            'gameList',
            'leaderboardCategory',
            'gameRankList',
            'playerRank',
        ]),
    },
})
export default class GamesRank extends Vue {
    page: number = 1;
    player: string = '';
    currentLeaderboard: any = null;
    selectedLeaderboard: any = {name: '', id: '', type: '', scoreType: '', scoreUnit: ''};
    rankSchedule: string = RANK.TOTAL;
    showPopup: boolean = false;
    popupPosition: any = {x: 620, y: 0};
    popupData: any = {name: '', type: 'clear'};

    async created() {
        const leaderboardCategorys: any = this.$store.getters.leaderboardCategory;
        let currentLeaderboard: any;

        this.$store.dispatch('showLoadingDim');
        if (!leaderboardCategorys || !leaderboardCategorys.length) {
            await this.$store.dispatch('getGameServiceInfo', this.$route.params.game);
        }

        if (leaderboardCategorys && leaderboardCategorys.length) {
            if (this.$route.query.boardId) {
                const index = leaderboardCategorys.findIndex((item: any) => {
                    return item._id === this.$route.query.boardId;
                });
                currentLeaderboard = leaderboardCategorys[index];
            } else {
                currentLeaderboard = leaderboardCategorys[0];
            }
            this.setLeaderboard(currentLeaderboard);
            this.selectLeaderboard(currentLeaderboard);
        } else {
            this.$store.commit('setRankList', null);
        }

        this.$store.dispatch('hideLoadingDim');
    }

    async selectLeaderboard(item: any) {
        this.setLeaderboard(item);
        await this.changeSchedule();
    }

    setLeaderboard(leaderboard: any) {
        const {name}: any = getObjectLocale(leaderboard.leaderBoardInfo);
        const {leaderBoardSort, leaderBoardScoreType, postFix} = leaderboard;
        this.currentLeaderboard = leaderboard;
        this.selectedLeaderboard = {
            name,
            id: leaderboard._id,
            type: this.$t('rank')[leaderboard.calculatorType],
            scoreType: leaderBoardSort,
            scoreUnit: leaderBoardScoreType,
            postFix,
        };
    }

    async changeSchedule() {
        this.page = 1;
        await this.getGameRankList();
    }

    async getGameRankList() {
        const appId: string = this.$route.params.game;
        const boardId: string = this.selectedLeaderboard.id;
        const type: string = this.rankSchedule;
        const scoreType: string = this.selectedLeaderboard.scoreType;
        const page: number = this.page;
        const params = {appId, boardId, type, scoreType, page};

        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getGameRankList', params);
        this.$store.dispatch('hideLoadingDim');
    }

    async changePage(page: number) {
        this.page = page;
        await this.getGameRankList();
    }

    async search() {
        const appId: string = this.$route.params.game;
        const scoreType: string = this.selectedLeaderboard.scoreType;
        const boardId: string = this.selectedLeaderboard.id;
        const type: string = this.rankSchedule;

        this.$store.dispatch('showLoadingDim');
        if (this.player) {
            await this.$store.dispatch('searchPlayerRank', {appId, boardId, scoreType, type, userId: this.player});
        } else {
           this.getGameRankList();
        }

        this.$store.dispatch('hideLoadingDim');
    }

    showHistoryPopup($event: MouseEvent, rank) {
        this.setPopupPosition($event);
        this.setPopupData(rank);
        this.showPopup = true;
    }

    setPopupData(data: any) {
        const {userId} = data;
        const rankList = this.$store.getters.gameRankList.list;
        const index = rankList.findIndex((item: any) => item.userId === userId);

        if (rankList[index]) {
            this.popupData = rankList[index];
        } else {
            this.popupData = {};
        }
        this.popupData.name = userId;
        this.popupData.type = 'clear';
    }

    setPopupPosition($event: MouseEvent) {
        const target: HTMLElement | any = $event.target;
        const parantElement: HTMLElement | null = target.parentElement.parentElement;
        const nodeHeight: number = parantElement!.offsetHeight;

        this.popupPosition.y = parantElement!.offsetTop + (nodeHeight / 2);
    }

    @Watch('$store.getters.leaderboardCategory')
    async updateLeaderboard(newValue: any) {
        if (newValue && newValue.length) {
            const currentLeaderboard = newValue[0];
            this.setLeaderboard(currentLeaderboard);
        }

        await this.getGameRankList();
    }

    @Watch('$route.params.lang')
    async beforeRouteUpdate() {
        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getGameServiceInfo', this.$route.params.game);
        this.$store.dispatch('hideLoadingDim');
    }

}
</script>
