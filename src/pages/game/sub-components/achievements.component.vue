<template>
    <div class="tbl gap-th achievements-list"
         @mouseleave="isContents = false">
        <table class="achievements-table">
            <colgroup>
                <col style="width: 106px" />
                <col />
                <col style="width: 12%" />
                <col style="width: 12%" />
            </colgroup>
            <thead>
            <tr>
                <th colspan="2">{{$t('game.submenuAchievements')}}</th>
                <th>
                    <span class="tit">{{$t('achievements.step')}}</span>
                </th>
                <th>
                    <span class="tit">{{$t('achievements.reward')}}</span>
                </th>
            </tr>
            </thead>
            <tbody v-if="achievements" class="achievements-tbody">
                <tr v-for="(item, index) in achievementsList[page - 1]"
                    v-if="!isPreview || (isPreview && index <= (LIST_SIZE - 1))"
                    :key="index">
                    <th>
                        <div class="cell" :class="{lock: !item.status}">
                            <span class="photo">
                                <itam-image :src="item.icon"/>
                            </span>
                            <span class="lock"><img src="@/assets/images/ico-lock.svg"/></span>
                        </div>
                    </th>
                    <td class="align-left"
                        @mouseenter="mouseoverContnet($event, index)">
                        <div v-if="item.status">
                            <h5>{{$options.filters.gameService(item.achievementInfo).name}}</h5>
                            <p>{{$options.filters.gameService(item.achievementInfo).description}}</p>
                        </div>
                        <h5 v-else>{{$t('achievements.seal')}}</h5>
                    </td>
                    <td>{{item.status ? item.achievementPerStep : '-'}}</td>
                    <td>{{item.achievementScore}}{{$t('rank.score')}}</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="5" class="empty-box">
                        {{$t('empty.achievements')}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="tableContents" ref="tableContents" class="contents-box"
             v-if="isContents"
             :style="{
                left: '80px',
                top: `${popupPositionY}px`,
             }">
            <h4>{{ nowContentsTitle }}</h4>
            <p>{{ nowContentsConent }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import achievements from './achievements.component.vue';
import {PAGINATION} from '../../../common/config/app.config';
import {getObjectLocale} from '../../../common/util/locale.util';
import itamImage from '@/components/itam-image.component.vue';
import {PREVIEW} from '@/common/config/app.config';

@Component({
    components: {
        achievements,
        itamImage,
    },
    computed: {
        ...mapGetters([
            'locale',
            'gameDefaultLocale',
            'achievements',
        ]),
    },
})
export default class GameAchievements extends Vue {
    isContents: boolean = false;
    popupPositionY: number = 0;
    nowContentsTitle: string = '';
    nowContentsConent: string = '';
    achievementsList: any[] = [];
    @Prop() readonly page!: number;
    @Prop() readonly isPreview?: boolean;
    readonly LIST_SIZE: number = PREVIEW.SIZE;

    async created() {
        this.$store.dispatch('showLoadingDim');
        if (!this.$store.getters.achievements) {
            await this.$store.dispatch('getGameServiceInfo', this.$route.params.game);
        }
        this.achievementsList = this.paging();
        this.$store.dispatch('hideLoadingDim');
    }

    paging() {
        const pagination: any[] = [];

        if (this.$store.getters.achievements) {
            this.$store.getters.achievements.forEach((item: any, index: number) => {
                const page: number = Math.floor(index / PAGINATION.SIZE);

                if (!pagination[page]) {
                    pagination[page] = [];
                }
                pagination[page].push(item);
            });
        }

        return pagination;
    }

    mouseoverContnet($event: MouseEvent, n: number) {
        this.setPopupPosition($event);
        const targetAchievements: any =  this.achievementsList[this.page - 1];
        const {name, description}: any = getObjectLocale(targetAchievements[n].achievementInfo);
        if (targetAchievements[n].status) {
            this.nowContentsTitle = name;
            this.nowContentsConent = description;
            this.isContents = true;
        }
    }

    setPopupPosition($event: MouseEvent) {
        const target: HTMLElement | any = $event.currentTarget;
        const parantElement: HTMLElement | null = target.parentElement;

        const nodes: any = Array.prototype.slice.call(document.querySelector('.achievements-tbody')!.children);
        const index: number = nodes.indexOf(parantElement);
        const nodeHeight: number = parantElement!.offsetHeight;

        this.popupPositionY = (nodeHeight * (index + 1)) + 10;
    }

    @Watch('$store.getters.achievements')
    update() {
        this.$store.dispatch('showLoadingDim');
        this.achievementsList = this.paging();
        this.$store.dispatch('hideLoadingDim');
    }
}
</script>
