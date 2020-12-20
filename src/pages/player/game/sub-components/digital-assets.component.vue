<template>
    <div>
        <div class="tit row">
            <h3>{{$t('game.digitalAssets')}}</h3>
        </div>
        <div class="point" v-if="playerDigitalAssets">
            {{$t('digitalAssets.total')}} : {{playerDigitalAssets.total}}{{$t('playerInfo.individual')}}
        </div>
        <div class="digital-box"
             v-if="playerDigitalAssets && playerDigitalAssets.total && digitalAssetsGroups && digitalAssetsGroups.length"
             @mouseleave="showPopup = false">
            <ul class="digital-list">
                <li v-for="(item, key) in playerDigitalAssets.list" :key="key">
                    <div class="cell"
                         @mouseover="showPopupDigital($event, key)">
                        <span class="photo">
                            <itam-image :src="getDigitalAssetsIcon(item.itemGroupId)"/>
                        </span>
                    </div>
                </li>
            </ul>
            <popup v-if="showPopup" :data="popupData" :position="popupPosition"/>
        </div>
        <div v-else class="empty-box digital-assets">
            {{$t('digitalAssets.empty')}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import popup from '@/components/popup.component.vue';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    components: {
        popup,
        itamImage,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'playerAchievements',
            'achievements',
            'totalScore',
            'playerDigitalAssets',
            'digitalAssetsGroups',
        ]),
    },
})
export default class Achievements extends Vue {
    showPopup: boolean = false;
    popupPosition: any = {x: 0, y: 140};
    popupData: any = {
        status: true,
        name: '디지털 자산 이름',
        type: 'clear',
        description: '',
        histories: [],
    };

    created() {
        this.initData();
    }

    async initData() {
        const {game, id} = this.$route.params;
        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getPlayerDigitalAssets', {appId: game, player: id});
        await this.$store.dispatch('getDigitalAssetsGroups', {appId: game});
        this.$store.dispatch('hideLoadingDim');
    }

    showPopupDigital($event: MouseEvent, idx) {
        this.setPopupPosition($event, idx);
        this.setPopupData(idx);
        this.showPopup = true;
    }

    setPopupData(index: number) {
        const {itemName, histories} = this.$store.getters.playerDigitalAssets.list[index];
        this.popupData.name = itemName;
        this.popupData.histories = histories;
    }

    setPopupPosition($event: MouseEvent, idx) {
        const target: HTMLElement | any = $event.currentTarget;
        const nodeWidth: number = target.parentElement.offsetWidth;
        const index: number = (Number(idx) > 8) ? 8 : Number(idx);

        this.popupPosition.x = index * nodeWidth + 30;
    }

    getDigitalAssetsIcon(groupId: string) {
        return this.$store.getters.digitalAssetsGroups.find((item) => {
            return item._id === groupId;
        }).icon;
    }

    @Watch('$route.params.game')
    beforeRouteUpdate() {
        this.initData();
    }
}
</script>
