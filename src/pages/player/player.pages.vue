<template>
    <div class="player" v-if="gameList && playerInfo">
        <player-header/>
        <div class="player-games" v-if="playerInfo.games">
            <h5>{{$t('player.played')}}</h5>
            <ul class="flex-box">
                <li v-for="game in playerInfo.games" v-if="gameList[game.appId]">
                    <button type="button"
                            class="btn js-playgame"
                            :class="{on: $route.params.game === game.appId}"
                            @click="goPage(game.appId)">
                        <span>
                            <itam-image :src="$options.filters.gameIcon(game.appId)"/>
                        </span>
                    </button>
                </li>
            </ul>
        </div><!--// player games -->

        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import playerHeader from './sub-components/player-header.component.vue';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'playerInfo',
            'gameList',
            'selectedGame',
            'achievements',
        ]),
    },
    components: {
        playerHeader,
        itamImage,
    },
})
export default class Player extends Vue {
    async mounted() {
        await this.initGame();
    }

    async initGame() {
        const {$route, $store} = this;
        const {params} = $route;
        const id: string = params.id;
        $store.dispatch('showLoadingDim');

        if (!$store.getters.playerInfo || $store.getters.playerInfo._id !== id) {
            await this.$store.dispatch('getPlayerInfo', id);
        }

        const game: string = this.$route.params.game;
        $store.dispatch('selectGame', game);
        await $store.dispatch('getEOSInfo', {userId: id, userGroup: $store.getters.userGroup});
        await this.$store.dispatch('getGameServiceInfo', this.$route.params.game);
        await $store.dispatch('getPlayerAchievements', {appId: game, userId: id});
        $store.dispatch('hideLoadingDim');
    }

    goPage(game: string) {
        this.$router.push({
            name: 'player-game',
            params: {
                id: this.$route.params.id,
                game,
            },
        });
    }

    @Watch('$route.params')
    async beforeRouteUpdate() {
        this.initGame();
    }

}
</script>
