<template>
    <div class="player-info">
        <div class="player-info-wrap">
            <div class="col-row">
                <div class="col-3-4">
                    <div class="flex-box">
                        <div class="player-info__photo">
                                <span class="user">
                                    <!--<img alt="" src="@/assets/images/sample-game.jpg" />-->
                                </span>
                        </div>
                        <div class="player-info__info">
                            <div class="player-info__info-id">
                                    <span class="id">
                                        {{$route.params.id}}
                                    </span>
                                <button type="button" class="btn js-bookmark"
                                        :class="{ on: isBookmark }"
                                        @click="toggleBookmark($route.params.id)">
                                    <i class="icon icon-star-full"></i> {{$t('home.bookmark')}}
                                </button>
                            </div>
                            <div class="player-info__info-eos">
                                <button type="button"
                                        v-if="userGroup === 'eos'"
                                        class="btn js-eosOpen"
                                        @click="toggleEosinfo">
                                    EOS : {{balance.unstaked.eos + balance.refund.eos + balance.staked.eos | eos}}
                                    <i class="icon icon-play-down"></i>
                                </button>
                                <button type="button" class="btn js-eosOpen" v-else>
                                    EOS : {{playerToken}}
                                </button>
                                <!-- eos 정보 상세 -->
                                <eos-modal v-if="isEosModal" @close="toggleEosinfo"/>
                            </div>
                            <div class="player-info__info-games" v-if="playerInfo.games">
                                <span>{{$t('player.played')}} : </span>
                                <b>{{playerInfo.games.length}}{{$t('playerInfo.individual')}}</b>
                            </div>
                        </div>
                    </div><!--// player info -->
                </div>
                <sub-header-search></sub-header-search>
            </div>
        </div>
    </div><!--// plaer infomation -->
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import modal from '@/components/modal.component.vue';
import subHeaderSearch from '@/components/sub-header-search.component.vue';
import eosModal from './eos-modal.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'balance',
            'resource',
            'playerToken',
            'playerInfo',
            'userGroup',
        ]),
    },
    components: {
        modal,
        eosModal,
        subHeaderSearch,
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

    toggleEosinfo() {
        this.isEosModal = !this.isEosModal;
    }

    openSearchHelper() {
        this.showSearchHelper = true;
    }

    closeSearchHelper() {
        this.showSearchHelper = false;
    }

    async search()  {
        const {$store, $router} = this;
        await $store.dispatch('getPlayerInfo', this.player);

        if ($store.getters.playerInfo) {
            $router.push(`${this.$route.fullPath}/player/${this.player}`);
        } else {
            this.isNotSearchModal = true;
        }
    }

    @Watch('$store.getters.bookmarks')
    updateBookmark() {
        this.isBookmark = this.$store.getters.bookmarks.findIndex((id: string) => id === this.$route.params.id) >= 0;
    }
}
</script>
