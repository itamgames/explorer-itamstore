<template>
    <div class="games box digital-assets">
        <div class="row title-locale">
            <div class="DH20"></div>
            <h3>{{$t('game.digitalAssets')}}
                <span v-if="symbol">({{symbol}})</span>
            </h3>
        </div>
        <div class="select-board row tit">
            <div class="fL selected">
                <div class="select typeB">
                    <h5 class="row">
                        <span>
                            <b v-if="selectedCategory">
                                {{$options.filters.digitalAssetsCategoryName(selectedCategory.categoryInfo)}}
                            </b>
                            <b v-else>
                                {{$t('rank.total')}}
                            </b>
                        </span>
                        <i class="icon icon-play-down"></i>
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
            </div>
        </div>
        <digital-assets :data="digitalAssets"
                        mode="game"
                        @change-category="changeCategory"/>
        <div class="pagination2">
            <pagination @change-page="changePage"
                        :page="page"
                        :total="digitalAssets ? digitalAssets.total : 1"/>
            <div class="search-box">
                <input type="text" class="search-box__input"
                       @keyup.enter="search"
                       :placeholder="$t('digitalAssets.search')" v-model="keyword"/>
                <button type="button" class="btn js-search" @click="search">
                    <i class="icon icon-search"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';
import digitalAssets from '@/components/digital-assets.component.vue';

@Component({
    components: {
        digitalAssets,
        pagination,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'symbol',
            'digitalAssetsCategorys',
            'digitalAssetsGroups',
            'digitalAssets',
        ]),
    },
})
export default class DigitalAssets extends Vue {
    page: number = 1;
    keyword: string = '';
    selectedCategory: any = null;

    changePage(page: number) {
        this.page = page;
        this.getDigitalAssets();
    }

    created() {
        this.initData();
    }

    async initData() {
        const {$store, $route} = this;
        const {game} = $route.params;
        this.$store.dispatch('showLoadingDim');
        await $store.dispatch('getDigitalAssetsCategorys', {appId: game});
        await $store.dispatch('getDigitalAssetsGroups', {appId: game});
        await this.changeCategory();
        this.$store.dispatch('hideLoadingDim');
    }

    async changeCategory(category?: any) {
        const {game} = this.$route.params;
        const params: any = {appId: game};

        this.selectedCategory = category;
        if (category) { params.categoryId = category._id; }
        await this.$store.dispatch('getDigitalAssets', params);
    }

    async getDigitalAssets() {
        this.$store.dispatch('showLoadingDim');
        const params: any = {
            appId: this.$route.params.game,
            page: this.page,
        };
        if (this.selectedCategory) { params.categoryId = this.selectedCategory._id; }
        if (this.keyword) { params.keyword = this.keyword; }

        await this.$store.dispatch('getDigitalAssets', params);
        this.$store.dispatch('hideLoadingDim');
    }

    async search() {
        this.page = 1;
        await this.getDigitalAssets();
    }

    @Watch('$route.params.game')
    async beforeRouteUpdate() {
        await this.initData();
    }
}
</script>