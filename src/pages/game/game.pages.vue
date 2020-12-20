<template>
    <div class="games" v-if="gameList && selectedGame">
        <div class="intro"
             :class="{ off:$route.name !== 'game' }">
            <div class="intro-bg"
                 :style="{backgroundImage: `url(${$options.filters.appendURL(selectedGame.header)})`}">
            </div>
            <div class="intro-game">
                <div class="intro-game-info">
                    <div class="intro-game-info__photo">
                        <itam-image :attributes="{alt: selectedGame.title}"
                                    :src="$options.filters.gameIcon($route.params.game)"/>
                    </div>
                    <h3><b>{{selectedGame.title}}</b></h3>
                </div>
            </div>
        </div><!--// intro -->
        <game-header/>
        <div class="wrap">
            <transition :name="$store.state.routeTransition">
                <game-info v-if="$route.name === 'game'"/>
                <router-view v-else></router-view>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import modal from '@/components/modal.component.vue';
import gameHeader from './sub-components/game-header.component.vue';
import gameInfo from './sub-components/game-info.component.vue';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    components: {
        modal,
        gameHeader,
        gameInfo,
        itamImage,
    },
    computed: {
        ...mapGetters([
            'locale',
            'gameList',
            'selectedGame',
            'gameDefaultLocale',
            'leaderboardCategory',
            'achievements',
        ]),
    },
})
export default class Game extends Vue {
    created() {
        this.initData();
    }

    async initData() {
        const game: string = this.$route.params.game;
        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('selectGame', game);
        this.$store.dispatch('hideLoadingDim');
    }

    @Watch('$route.params.game')
    async beforeRouteUpdate() {
        await this.initData();
    }
}
</script>
