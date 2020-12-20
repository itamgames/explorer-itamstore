<template>
    <div class="col-1-4 align-right">
        <div class="search-box"
             @mouseleave="closeSearchHelper">
            <input type="text" class="search-box__input"
                   @focus="openSearchHelper"
                   @click="openSearchHelper"
                   @keyup.enter="search"
                   v-model="player"
                   :placeholder="$t('home.search')"/>
            <button type="button" class="btn js-search"
                    @click="search">
                <i class="icon icon-search"></i>
            </button>
            <search-helper @search="search" v-if="showSearchHelper"/>
        </div><!--// search box -->
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import modal from '@/components/modal.component.vue';
import searchHelper from '@/components/search-helper.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'playerInfo',
            'bookmarks',
        ]),
    },
    components: {
        modal,
        searchHelper,
    },
})
export default class PlayerHeader extends Vue {
    isBookmark: boolean = false;
    isEosModal: boolean = false;
    showSearchHelper: boolean = false;
    isNotSearchModal: boolean = false;
    player: string = '';

    mounted() {
        const {$store, $route} = this;
        this.isBookmark = $store.getters.bookmarks.findIndex((id: string) => id === $route.params.id) >= 0;
    }

    toggleBookmark(id: string) {
        this.isBookmark = !this.isBookmark;

        if (this.isBookmark) {
            this.$store.dispatch('addBookmark', id);
        } else {
            this.$store.dispatch('removeBookmark', id);
        }
    }

    openSearchHelper() {
        this.showSearchHelper = true;
    }

    closeSearchHelper() {
        this.showSearchHelper = false;
    }

    async search()  {
        if (!this.player) { return; }

        const {$store, $router} = this;
        $store.dispatch('showLoadingDim');

        try {
            await $store.dispatch('getPlayerInfo', this.player);

            if ($store.getters.playerInfo) {
                $store.dispatch('addRetrievedID', this.player);
                $router.push({name: 'player', params: {id: this.player}});
            } else {
                this.isNotSearchModal = true;
            }

        } finally {
            $store.dispatch('hideLoadingDim');
        }
    }
}
</script>

<style scoped>

</style>
