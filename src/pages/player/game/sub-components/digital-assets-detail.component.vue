<template>
    <div>
        <div class="select-board row tit">
            <div class="fL">
                <h4>{{$t('game.category')}}:</h4>
                <div class="select">
                    <h5 class="row">
                        <span>
                            <b v-if="selectedCategory">
                                {{$options.filters.digitalAssetsCategoryName(selectedCategory.categoryInfo)}}
                            </b>
                            <b v-else>
                                {{$t('rank.total')}}
                            </b>
                        </span>
                        <i class="icon icon-arrow-down-light"></i>
                    </h5>
                    <ul class="select-list" v-if="digitalAssetsCategorys">
                        <li>
                            <button type="button" class="js-select-btn" @click="changeCategory()">
                                <span><b>{{$t('rank.total')}}</b></span>
                            </button>
                        </li>
                        <li v-for="item in digitalAssetsCategorys">
                            <button type="button" class="js-select-btn" @click="changeCategory(item)">
                            <span>
                                <b>{{$options.filters.digitalAssetsCategoryName(item.categoryInfo)}}</b>
                            </span>
                            </button>
                        </li>
                    </ul>
                </div>
                <h4>{{$t('game.nickname')}} :</h4>
                <div class="select">
                    <h5 class="row">
                        <span>
                            <b v-if="selectedNickname">
                                {{selectedNickname}}
                            </b>
                            <b v-else>
                                {{$t('rank.total')}}
                            </b>
                        </span>
                        <i class="icon icon-arrow-down-light"></i>
                    </h5>
                    <ul class="select-list" v-if="playerNicknames && playerNicknames.length > 0">
                        <li>
                            <button type="button" class="js-select-btn" @click="changeNickname('')">
                                <span><b>{{$t('rank.total')}}</b></span>
                            </button>
                        </li>
                        <li v-for="nickname in playerNicknames">
                            <button type="button" class="js-select-btn" @click="changeNickname(nickname._id)">
                            <span>
                                <b>{{nickname._id}}</b>
                            </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <digital-assets-detail :data="playerDigitalAssets"
                               mode="player"
                               @change-category="changeCategory"/>
        <pagination class="pagination2"
                    @change-page="changePage"
                    :page="page"
                    :total="playerDigitalAssets ? playerDigitalAssets.total : 1"/>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';
import digitalAssetsDetail from '@/components/digital-assets.component.vue';

@Component({
    components: {
        digitalAssetsDetail,
        pagination,
    },
    computed: {
        ...mapGetters([
            'playerDigitalAssets',
            'playerNicknames',
            'digitalAssetsCategorys',
        ]),
    },
})
export default class DigitalAssets extends Vue {
    page: number = 1;
    selectedNickname: string = '';
    selectedCategory: any = null;

    changePage(page: number) {
        this.page = page;
    }

    created() {
        this.initData();
    }

    async initData() {
        const {$store, $route} = this;
        const {game, id} = $route.params;
        this.$store.dispatch('showLoadingDim');
        await $store.dispatch('getDigitalAssetsCategorys', {appId: game});
        await $store.dispatch('getDigitalAssetsGroups', {appId: game});
        await this.$store.dispatch('getPlayerNicknamesFromAssets', {appId: game, userId: id});
        await this.changeCategory();
        this.$store.dispatch('hideLoadingDim');
    }

    async changeCategory(category?: any) {
        this.selectedCategory = category;
        await this.getPlayerDigitalAsset();
    }

    async changeNickname(nickname: string) {
        this.selectedNickname = nickname;
        await this.getPlayerDigitalAsset();
    }

    async getPlayerDigitalAsset() {
        const params: any = {appId: this.$route.params.game};

        if (this.selectedNickname) {
            params.player = this.selectedNickname;
        } else {
            params.player = this.$route.params.id;
        }
        if (this.selectedCategory) {
            params.categoryId = this.selectedCategory._id;
        }

        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getPlayerDigitalAssets', params);
        this.$store.dispatch('hideLoadingDim');
    }

    @Watch('$route.params.game')
    beforeRouteUpdate() {
        this.initData();
    }
}
</script>