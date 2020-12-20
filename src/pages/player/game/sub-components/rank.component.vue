<template>
    <div>
        <div class="tit row select-board">
            <div class="fL selected">
                <div class="select typeB">
                    <h5 class="row" v-if="leaderboardCategory && leaderboardCategory.length">
                        <span><b>{{selectedLeaderboard.name}}</b> ({{selectedLeaderboard.type}})</span>
                        <i class="icon icon-play-down"></i>
                    </h5>
                    <ul class="select-list">
                        <li v-for="item in leaderboardCategory">
                            <button type="button" class="js-select-btn" @click="selectLeaderboard(item)">
                            <span>
                                <b>{{$options.filters.gameService(item.leaderBoardInfo).name}}</b>
                                ({{$t('rank')[item.calculatorType]}})
                            </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fR" v-if="!simpleMode">
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
        <div class="tbl">
            <table @mouseleave="showPopup = false">
                <colgroup>
                    <col style="width: 80px" />
                    <col />
                    <col style="width: 20%" />
                    <col style="width: 20%" />
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
                    <tr v-for="(player, index) in rankList"
                        :class="{my: player.userId === $route.params.id}">
                        <th>
                            {{player.rank}}
                        </th>
                        <td class="align-left">
                            <router-link :to="{name: 'player', params: {game: $route.params.game, id: player.userId}}">
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
                                  @mouseover="showHistoryPopup($event, player)">
                                    {{$t('rank.recordViewing')}}
                            </span>
                        </td>
                    </tr>
                    <tr class="my" v-if="!hasPlayer() && playerRank && gameRankList.total">
                        <th>
                             {{playerRank.rank}}
                        </th>
                        <td class="align-left">
                            <router-link :to="{name: 'player-game',
                                params: {game: $route.params.game,
                                id: $route.params.id}}">
                                {{$route.params.id}}
                            </router-link>
                            <span class="nick" v-if="playerRank.nickname && playerRank.nickname !== ''">{{ playerRank.nickname }}</span>
                        </td>
                        <td>
                            {{playerRank.score | leaderboardScoreType(selectedLeaderboard)}}
                            <span v-if="selectedLeaderboard.scoreUnit === 'num'">
                                {{selectedLeaderboard.postFix ? selectedLeaderboard.postFix : $t('rank.score')}}
                            </span>
                        </td>
                        <td>
                            <span class="underline"
                                  @mouseover="showHistoryPopup($event, playerRank)">
                                {{$t('rank.recordViewing')}}
                            </span>
                        </td>
                    </tr>
                    <tr class="my" v-else-if="!hasPlayer()">
                        <th>-</th>
                        <td class="align-left">
                            <router-link :to="{name: 'player-game',
                                params: {game: $route.params.game,
                                id: $route.params.id}}">
                                {{$route.params.id}}
                            </router-link>
                        </td>
                        <td>- {{$t('rank.score')}}</td>
                        <td>
                            <span class="underline">
                                {{$t('rank.empty')}}
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
        <div class="more" v-if="!simpleMode">
            <router-link :to="{name: 'rank', params:{game: $route.params.game}}">
                <span>{{$t('rank.allView')}}</span>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {RANK} from '../../../../common/config/app.config';
import popup from '@/components/popup.component.vue';
import {getObjectLocale} from '../../../../common/util/locale.util';

@Component({
    components: {
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
export default class Rank extends Vue {
    @Prop() readonly simpleMode!: boolean;
    currentLeaderboard: any = null;
    selectedLeaderboard: any = {name: '', id: '', type: '', scoreType: '', scoreUnit: ''};
    showPopup: boolean = false;
    popupPosition: any = {x: this.simpleMode ? 165 : 620, y: 0};
    popupData: any = {name: '', type: 'clear'};
    rankSchedule: string = RANK.TOTAL;
    rankList: any[] = [];

    async mounted() {
        this.$store.dispatch('showLoadingDim');
        const leaderboardCategory: any = this.$store.getters.leaderboardCategory;
        if (leaderboardCategory && leaderboardCategory.length) {
            const currentLeaderboard = this.$store.getters.leaderboardCategory[0];
            await this.selectLeaderboard(currentLeaderboard);
            this.rankList = this.sliceGameRankList();
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

    hasPlayer() {
        return this.$store.getters.gameRankList.list
                                               .slice(0, RANK.SUMMARY_MAX_VIEW_NUM)
                                               .some((item: any) => {
                                                   return item.userId === this.$route.params.id;
                                                });
    }

    sliceGameRankList() {
        let list: any[] = this.$store.getters.gameRankList.list;

        if (!this.hasPlayer()) {
            list = list.slice(0, RANK.SUMMARY_MAX_VIEW_NUM - 1);
        } else {
            list = list.slice(0, RANK.SUMMARY_MAX_VIEW_NUM);
        }

        return list;
    }

    async getGameRankList() {
        const appId: string = this.$route.params.game;
        const boardId: string = this.selectedLeaderboard.id;
        const type: string = this.rankSchedule;
        const scoreType: string = this.selectedLeaderboard.scoreType;
        const params = {appId, boardId, type, scoreType};

        this.$store.dispatch('showLoadingDim');

        await this.$store.dispatch('getGameRankList', {...params});

        if (!this.hasPlayer() && this.$store.getters.gameRankList.total) {
            const userId: string = this.$route.params.id;
            const playerPrams = {userId, ...params};
            await this.$store.dispatch('getPlayerRank', playerPrams);
        }

        this.rankList = this.sliceGameRankList();

        this.$store.dispatch('hideLoadingDim');
    }

    async changeSchedule() {
        await this.getGameRankList();
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
            this.popupData = data;
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

    @Watch('$store.getters.leaderboardCategory', {immediate: true, deep: true})
    async updateLeaderboard(newValue: any[]) {
        if (newValue && newValue.length) {
            const currentLeaderboard = newValue[0];
            this.setLeaderboard(currentLeaderboard);
            await this.getGameRankList();
        }
    }

    @Watch('$route.params.lang')
    async changeLocale() {
        this.setLeaderboard(this.currentLeaderboard);
    }
}
</script>
