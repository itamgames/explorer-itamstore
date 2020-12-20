<template>
    <div>
        <div class="tbl gap-th" @mouseleave="closePopups">
            <table>
                <colgroup>
                    <col style="width: 106px" />
                    <col />
                    <col style="width: 20%"/>
                    <col style="width: 20%"/>
                    <col style="width: 20%"/>
                </colgroup>
                <thead>
                <tr>
                    <th colspan="2" class="align-left">{{$t('game.digitalAssets')}}</th>
                    <th>{{$t('game.nickname')}} </th>
                    <th>
                        <span class="tit">{{$t('game.category')}}</span>
                    </th>
                    <th>{{mode === 'player' ? 'History' : 'Owner'}}</th>
                </tr>
                </thead>
                <tbody class="digital-assets-tbody"
                       v-if="data && data.total && digitalAssetsGroups && digitalAssetsCategorys">
                    <tr v-for="(item, index) in data.list"
                        v-if="!isPreview || (isPreview && index <= (LIST_SIZE - 1))">
                        <th>
                            <div class="cell">
                                <span class="photo" @click="showItemOptions(item.itemId, item.itemGroupId)">
                                    <itam-image :src="getDigitalAssetsGroup(item.itemGroupId).icon"/>
                                </span>
                            </div>
                        </th>
                        <td class="align-left">
                            <h5>{{item.itemName}}</h5>
                            <p>
                                {{$options.filters
                                    .digitalAssetsGroup(getDigitalAssetsGroup(item.itemGroupId).groupInfo).name}}
                            </p>
                        </td>
                        <td>{{item.nickName}}</td>
                        <td>
                            {{getDigitalAssertCategory(item.categoryId) | digitalAssetsCategoryName}}
                        </td>
                        <td class="underline"
                            @mouseenter="showPopupDigital($event, index)">
                            {{mode === 'player' ? $t('rank.recordViewing') : item.userId}}
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5" class="empty-box">
                            {{$t('digitalAssets.empty')}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <modal  class="free-size" v-show="showModal" @afterClose="() => {showModal = false}">
                <div class="item-options">
                    <div class="cell">
                        <span class="photo">
                            <itam-image :src="getDigitalAssetsGroup(itemInfo.icon).icon"/>
                        </span>
                    </div>
                    <h3>{{itemInfo.name}}</h3>
                    <p>{{itemInfo.description}}</p>
                    <ul>
                        <li v-for="(value, key) in itemInfo.options">
                            <span>{{key}}</span><b>{{value}}</b>
                        </li>
                    </ul>
                </div>
            </modal>
            <!--<div id="tableContents" ref="tableContents" class="contents-box"-->
                 <!--:style="{-->
                    <!--left: '80px',-->
                    <!--top: `${popupPositionY}px`,}"-->
                 <!--v-if="isContents">-->
                <!--<h4>{{ nowContentsTitle }}</h4>-->
                <!--<ul>-->
                    <!--<li v-for="(value, key) in nowDigitalAssetsOptions">-->
                        <!--{{key}}: {{value}}-->
                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
            <popup v-if="showPopup" :data="popupData" :position="{x: 610, y: popupPositionY}"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Emit, Prop} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';
import popup from '@/components/popup.component.vue';
import {PREVIEW} from '../common/config/app.config';
import itamImage from '@/components/itam-image.component.vue';
import {AccountAxiosService} from '../common/service/account-axios.service';
import modal from '@/components/modal.component.vue';
import {AXIOS} from '@/common/config/env.config';

@Component({
    components: {
        pagination,
        popup,
        itamImage,
        modal,
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
    @Prop() readonly data!: any;
    @Prop() readonly mode!: string;
    @Prop() readonly isPreview?: boolean;
    readonly LIST_SIZE: number = PREVIEW.SIZE;

    isContents: boolean = false;
    nowContentsTitle: string = '';
    nowDigitalAssetsOptions: any = {};

    showModal: boolean = false;
    showPopup: boolean = false;
    popupPositionY: number = 0;
    popupData: any = {
        status: true,
        type: 'clear',
        description: '',
        histories: [],
    };
    itemInfo: any = {
        name: '',
        description: '',
        options: {},
        icon: '',
    };

    @Emit()
    async changeCategory(category?: any) {
        return category;
    }

    mouseoverContnet($event: MouseEvent, n: number) {
        this.setPopupPosition($event, n);
        const data = this.data.list[n];

        this.isContents = true;
        this.nowContentsTitle = data.itemName;
        this.nowDigitalAssetsOptions = data.options;
    }

    setPopupPosition($event: MouseEvent, index: number) {
        const target: HTMLElement | any = $event.currentTarget;
        const nodeHeight: number = target!.offsetHeight;
        this.popupPositionY = (nodeHeight * (index + 1)) + 10;
    }

    getDigitalAssetsGroup(groupId: string) {
        if (this.$store.getters.digitalAssetsGroups) {
            return this.$store.getters.digitalAssetsGroups.find((item: any) => {
                return item._id === groupId;
            }) || {};
        } else {
            return {};
        }
    }

    getDigitalAssertCategory(categoryId: string) {
        const category: any =  this.$store.getters.digitalAssetsCategorys.find((item: any) => {
            return item._id === categoryId;
        });

        return category.categoryInfo || {};
    }

    showPopupDigital($event: MouseEvent, idx) {
        this.setPopupPosition($event, idx);
        this.setPopupData(idx);
        this.showPopup = true;
    }

    setPopupData(index: number) {
        const {itemName, histories} = this.data.list[index];
        this.popupData.name = itemName;
        this.popupData.histories = histories;
    }

    async showItemOptions(itemId: string, itemGroupId: string) {
        const result: any = await AccountAxiosService.Instance.get(
            `${AXIOS.MOBILE_URL}/get-item-info`,
            {params: {itemId, lang: this.$store.getters.locale}},
        );

        this.showModal = true;
        this.itemInfo = {...result.itemInfo, options: result.options, icon: itemGroupId};
    }

    closePopups() {
        this.isContents = false;
        this.showPopup = false;
    }
}
</script>

<style lang="scss" scoped>
    .photo {
        display: inline-block;
        width: 66px;
        height: 66px;
        border: 3px solid #a79fb0;
        background-color: #e8e8e8;
    }

    .digital-assets-tbody {
        .cell {
            cursor: pointer;
        }
    }

    .item-options {
        padding: 30px;
        width: 300px;
        text-align: center;

        h3{
            margin-top: 10px;
        }

        p {
            width: auto;
            max-height: none;
        }

        ul {
            background: #e8e7e8;
            padding: 10px;
            margin-top: 10px;
            text-align: left;
            li {
                font-size: 12px;

                b{
                    float: right;
                    color: #a79fb0;
                }
                span {
                    float: left;
                }
                overflow: hidden;
            }
        }
    }
</style>
