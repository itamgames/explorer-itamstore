<template>
    <div class="tbl gap-th sub" @mouseleave="isContents = false">
        <table class="achievements-table">
            <colgroup>
                <col style="width: 106px" />
                <col />
                <col style="width: 20%" />
            </colgroup>
            <thead>
            <tr>
                <th colspan="2">{{$t('game.digitalAssets')}}</th>
                <th>
                    <span class="tit">{{$t('game.category')}}</span>
                </th>
            </tr>
            </thead>
            <tbody class="digital-assets-tbody"
                   v-if="digitalAssetsGroups && digitalAssetsGroups.total">
                <tr v-for="(item, index) in digitalAssetsGroups.list"
                    @mouseenter="mouseoverContnet($event, index)">
                    <th>
                        <div class="cell">
                            <span class="photo">
                                <itam-image :src="item ? item.icon : ''"/>
                            </span>
                        </div>
                    </th>
                    <td class="align-left">
                        <h5>{{$options.filters.digitalAssetsGroup(item.groupInfo).name}}</h5>
                        <p>{{$options.filters.digitalAssetsGroup(item.groupInfo).description}}</p>
                    </td>
                    <td>
                        {{$options.filters.digitalAssetsCategoryName(findCategory(item.categoryId))}}
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="3" class="empty-box">
                        {{$t('digitalAssets.empty')}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="tableContents" ref="tableContents" class="contents-box"
             v-if="isContents"
             :style="{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
             }">
            <h4>{{ nowContentsTitle }}</h4>
            <p>{{ nowContentsConent }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';
import {getObjectLocale} from '../../../common/util/locale.util';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    components: {
        pagination,
        itamImage,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'symbol',
            'digitalAssetsCategorys',
            'digitalAssetsGroups',
        ]),
    },
})
export default class DigitalAssets extends Vue {
    page: number = 1;
    isContents: boolean = false;
    popupPosition: any = {x: 200, y: 0};
    nowContentsTitle: string = '';
    nowContentsConent: string = '';

    created() {
        if (!this.$store.getters.digitalAssetsCategorys) {
            this.initData(this.$route.params.game);
        }
    }

    async initData(game: string) {
        const {$store} = this;
        this.$store.dispatch('showLoadingDim');
        await $store.dispatch('getDigitalAssetsCategorys', {appId: game});
        await $store.dispatch('getDigitalAssetsGroups', {appId: game});
        this.$store.dispatch('hideLoadingDim');
    }

    findCategory(id: string) {
        const category: any = this.$store.getters.digitalAssetsCategorys.find((item: any) => {
            return item._id = id;
        });

        return category.categoryInfo;
    }

    mouseoverContnet($event: MouseEvent, n: number) {
        this.setPopupPosition($event, n);
        const {digitalAssetsGroups} = this.$store.getters;
        const targetDigitalAssets: any = digitalAssetsGroups.list;
        const {name, description}: any = getObjectLocale(targetDigitalAssets[n].groupInfo);

        this.isContents = true;
        this.nowContentsTitle = name;
        this.nowContentsConent = description;
    }

    setPopupPosition($event: MouseEvent, index: number) {
        const target: HTMLElement | any = $event.currentTarget;
        const nodeHeight: number = target!.offsetHeight;
        this.popupPosition.y = (nodeHeight * (index + 1)) + 10;
    }

    @Watch('$route.params.game')
    async beforeRouteUpdate(game, b) {
        this.initData(game);
    }
}
</script>