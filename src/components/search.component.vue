<template>
    <div class="search-box"
         @mouseleave="closeSearchHelper">
        <input type="text" class="search-box__input"
               @focus="openSearchHelper"
               @click="openSearchHelper"
               @keyup.enter="search"
               v-model="player"
               :placeholder="$t('home.search')"/>
        <button  type="button" class="btn js-search"
                 @click="search">
            <span>Search</span>
        </button>

        <search-helper @search="search" v-if="showSearchHelper"/>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import searchHelper from '@/components/search-helper.component.vue';

@Component({
    components: {
        searchHelper,
    },
})
export default class Search extends Vue {
    player: string = '';
    showSearchHelper: boolean = false;

    openSearchHelper() {
        this.showSearchHelper = true;
    }

    closeSearchHelper() {
        this.showSearchHelper = false;
    }

    async search() {
        if (!this.player) { return; }

        const {$store, $router} = this;
        $store.dispatch('showLoadingDim');
        const player: string = this.player;

        try {
            await $store.dispatch('getPlayerInfo', player);

            if ($store.getters.playerInfo) {
                $store.dispatch('addRetrievedID', this.player);
                $router.push({name: 'player', params: {id: player}});
            }
        } finally {
            $store.dispatch('hideLoadingDim');
        }
    }
}
</script>