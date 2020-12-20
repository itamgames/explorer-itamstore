<template>
    <div class="submenu" :class="{ game_home: $route.name === 'game' }">
        <div class="wrap">
            <div class="col-row">
                <div class="col-3-4 align-left">
                    <div class="photo">
                        <itamImage :src="$options.filters.gameIcon($route.params.game)"/>
                    </div>
                    <ul class="submenu-list">
                        <li :class="{ on: $route.name === 'game' }">
                            <router-link :to="{name: 'game', params:{game: $route.params.game}}">
                                HOME
                            </router-link>
                        </li>
                        <li :class="{ on: $route.name === 'achievements' }">
                            <router-link :to="{name: 'achievements', params:{game: $route.params.game}}">
                                {{$t('game.submenuAchievements')}}
                            </router-link>
                        </li>
                        <li :class="{ on: $route.name === 'rank' }">
                            <router-link :to="{name: 'rank', params:{game: $route.params.game}}">
                                {{$t('game.submenuRank')}}
                            </router-link>
                        </li>
                        <li :class="{ on: $route.name === 'digital-assets' }">
                            <router-link :to="{name: 'digital-assets', params:{game: $route.params.game}}">
                                {{$t('game.digitalAssets')}}
                            </router-link>
                        </li>
                        <li :class="{ on: $route.name === 'notice' }">
                            <router-link :to="{name: 'notice', params:{game: $route.params.game}}">
                                {{$t('game.submenuNotice')}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <sub-header-search/>
            </div>
        </div>
    </div><!--// sub menu -->
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import modal from '@/components/modal.component.vue';
import subHeaderSearch from '@/components/sub-header-search.component.vue';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'bookmarks',
        ]),
    },
    components: {
        modal,
        subHeaderSearch,
        itamImage,
    },
})
export default class GameHeader extends Vue {
    isBookmark: boolean = false;
    isEosModal: boolean = false;
    showSearchHelper: boolean = false;
    isNotSearchModal: boolean = false;
    player: string = '';

    toggleBookmark(id: string) {
        this.isBookmark = !this.isBookmark;

        if (this.isBookmark) {
            this.$store.dispatch('addBookmark', id);
        } else {
            this.$store.dispatch('removeBookmark', id);
        }
    }

    toggleEosinfo() {
        this.isEosModal = !this.isEosModal;
    }

    openSearchHelper() {
        this.showSearchHelper = true;
    }

    closeSearchHelper() {
        this.showSearchHelper = false;
    }
}
</script>

<style scoped>

</style>
