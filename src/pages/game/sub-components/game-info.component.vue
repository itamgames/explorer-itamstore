<template>
    <div class="games-body box">
        <div class="news">
            <h3>{{$t('game.info')}}</h3>
            <div class="news-contents row">
                <div class="news-contents__view">
                    <h2>{{selectedGame.title}}</h2>
                    <div class="news-contents__view-star">
                        <i class="icon icon-star-full"
                           :class="{on: n <= gameList[$route.params.game].star}"
                           v-for="n in 5"></i>
                    </div>
                    <p class="description">{{selectedGame.shortDescription}}</p>

                </div>
                <div class="news-contents__list">
                    <ul v-if="notices && notices.list.length">
                        <li v-for="(news, index) in notices.list" v-if="index <= 2">
                            <button type="button" class="js-news" @click="goNoticePage(news._id)">
                                <p>{{getNoticeTitle(news)}}</p>
                                <span class="date">{{ news.createAt | convertDateFormat}}</span>
                            </button>
                        </li>
                    </ul>
                    <div v-else class="empty-box">
                        {{$t('empty.notice')}}
                    </div>
                </div>
            </div>
        </div>

        <div class="service">
            <div class="row title-locale">
                <h3>{{$t('game.gameService')}}</h3>
            </div>

            <div class="leader">
                <div>
                    <h4 class="row">
                        <span>{{$t('game.submenuRank')}}</span>

                        <router-link :to="{name: 'rank', params:{game: $route.params.game}}">
                            {{$t('button.more')}}
                        </router-link>
                    </h4>

                    <div class="tbl gap-th">
                        <leaderboard/>
                    </div>
                </div><!--// 리더보드 -->

                <div class="DH20"></div>

                <div>
                    <h4 class="row">
                        <span>{{$t('game.submenuAchievements')}}</span>
                        <router-link :to="{name: 'achievements', params:{game: $route.params.game}}">
                            {{$t('button.more')}}
                        </router-link>
                    </h4>
                    <achievements :isPreview="true" :page="1"/>
                </div>
                <div class="DH20"></div>
                <div>
                    <h4 class="row">
                        <span>{{$t('game.digitalAssets')}}</span>
                        <router-link :to="{name: 'digital-assets', params:{game: $route.params.game}}">
                            {{$t('button.more')}}
                        </router-link>
                    </h4>
                    <digital-assets :data="digitalAssets"
                                    mode="game"
                                    :isPreview="true"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import achievements from './achievements.component.vue';
import digitalAssets from '@/components/digital-assets.component.vue';
import leaderboard from './leaderboard.component.vue';

@Component({
    components: {
        achievements,
        digitalAssets,
        leaderboard,
    },
    computed: {
        ...mapGetters([
            'locale',
            'gameList',
            'selectedGame',
            'notices',
            'achievements',
            'gameDefaultLocale',
            'leaderboardCategory',
            'digitalAssets',
        ]),
    },
})
export default class GameInfo extends Vue {
    async created() {
        this.initData();
    }

    async initData() {
        const {$store, $route} = this;
        const {dispatch} = $store;
        const {game} = $route.params;
        dispatch('showLoadingDim');

        await dispatch('getGameServiceInfo', game);
        await dispatch('getGameNotices', {appId: game, page: 1});
        await dispatch('getDigitalAssetsCategorys', {appId: game});
        await dispatch('getDigitalAssetsGroups', {appId: game});
        await dispatch('getDigitalAssets', {appId: game});

        dispatch('hideLoadingDim');
    }

    getNoticeTitle(news: any) {
        const getters = this.$store.getters;

        if (news.newsInfo[getters.locale]) {
            return news.newsInfo[getters.locale].title;
        } else if (news.newsInfo[getters.gameDefaultLocale]) {
            return news.newsInfo[getters.gameDefaultLocale].title;
        } else {
            const locale = Object.keys(news.newsInfo)[0];
            return news.newsInfo[locale].title;
        }
    }

    goNoticePage(id: string) {
        this.$store.dispatch('selectNotice', id);
        this.$router.push(`${this.$route.fullPath}/notice/${id}`);
    }

    @Watch('$route.params.game')
    async changeGame(newVal, oldVal) {
        if (newVal !== oldVal) {
            await this.initData();
        }
    }

    @Watch('$route.params.lang')
    async changeLang() {

        this.$store.dispatch('selectGame', this.$route.params.game);
    }
}
</script>
