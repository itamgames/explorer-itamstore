<template>
    <div class="selected-game" v-if="gameList && achievements && playerInfo && selectedGame">
        <div class="intro">
             <itam-image :src="selectedGame.header"/>
        </div>
        <div class="selected-game__wrap">
            <div class="selected-game__info">
                <div class="selected-game__info-photo">
                    <itam-image :src="selectedGame.icon"/>
                </div>
                <div class="date">
                    {{$t('player.lastLogin')}} : {{getLastLogin() | convertDateFormat}}
                </div>
                <h3>{{selectedGame.title}}</h3>
                <div class="achievements col-row">
                    <div class="cell">
                        <span>{{$t('player.totalScore')}} :</span>
                        <b>{{totalScore}}</b>
                    </div>
                    <div class="cell">
                        <span>{{$t('player.userAchievements')}} :</span>
                        <b>
                            {{getAchievedCount() | percentage(achievements ? achievements.length : 0)}}
                            ({{getAchievedCount()}}/{{achievements ? achievements.length : 0}})
                        </b>
                    </div>
                </div>
            </div><!--// selected game infomation -->
            <div class="submenu row">
                <div class="fL">
                    <a :class="{ on: submenu === 'summary' }"
                       @click="selectTab('summary')"
                       v-html="$t('player.summary')">
                        종합
                    </a>
                    <a :class="{ on: submenu === 'achievements' }"
                       @click="selectTab('achievements')"
                       v-html="$t('player.achievements')">
                        업적
                    </a>
                    <a :class="{ on: submenu === 'rank' }"
                       @click="selectTab('rank')"
                       v-html="$t('player.leaderBoard')">
                        리더보드
                    </a>
                    <a :class="{ on: submenu === 'digital-assets'}"
                       @click="selectTab('digital-assets')"
                       v-html="$t('game.digitalAssets')">
                        디지털 자산
                    </a>
                </div>
            </div><!--// submenu -->
            <div class="board sub">
                <player-summary v-if="submenu === 'summary'"
                                @change-tab="selectTab"/>
                <achievements-detail class="achievements"
                                     v-if="submenu === 'achievements'"/>
                <rank-detail class="rank"
                             v-if="submenu === 'rank'"/>
                <digital-assets-detail class="digital-assets rank"
                                       v-if="submenu === 'digital-assets'"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import playerSummary from './sub-components/summary.component.vue';
import achievementsDetail from './sub-components/achievements.component.vue';
import rankDetail from './sub-components/rank.component.vue';
import itamImage from '@/components/itam-image.component.vue';
import digitalAssetsDetail from './sub-components/digital-assets-detail.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'playerAchievements',
            'gameList',
            'achievements',
            'selectedGame',
            'totalScore',
            'playerInfo',
            'achievements',
        ]),
    },
    components: {
        playerSummary,
        achievementsDetail,
        rankDetail,
        itamImage,
        digitalAssetsDetail,
    },
})
export default class Player extends Vue {
    submenu: string = 'summary';

    async initData() {
        const {$route, $store} = this;
        const {id, game} = $route.params;
        const param = {userId: id, appId: game};

        $store.dispatch('showLoadingDim');
        await $store.dispatch('getGameRankList', param);
        this.$store.dispatch('selectGame', game);
        await $store.dispatch('getGameServiceInfo', game);

        $store.dispatch('hideLoadingDim');
    }

    getLastLogin() {
        const games: any[] = this.$store.getters.playerInfo.games;
        const index: number = games.findIndex((game: any) => {
            return game.appId === this.$route.params.game;
        });

        return games[index].lastLoginAt;
    }

    selectTab(tab: string) {
        this.$nextTick(() => {
            this.submenu = tab;
        });
    }

    getAchievedCount() {
        const playerAchievements = this.$store.getters.playerAchievements;
        const count: number = Object.keys(playerAchievements).filter((key: string) => {
            return playerAchievements[key].isDone === 'done';
        }).length;

        return count;
    }

    @Watch('$route.params')
    async changePrameter() {
        await this.initData();
    }
}
</script>
