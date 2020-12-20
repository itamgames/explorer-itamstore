<template>
    <div>
        <div class="tit row">
            <h3>{{$t('player.achievements')}}</h3>
        </div>
        <div class="point row">
            <div class="fL">
                {{$t('player.userTotalScore')}} : {{totalScore}}
            </div>
            <div class="fR" v-if="achievements && playerAchievements">
                {{getAchievedCount()| percentage(achievements.length)}}
                ({{getAchievedCount()}}/{{achievements.length}})
            </div>
        </div>
        <ul v-if="achievements" class="achievements-list" @mouseleave="showPopup = false">
            <li v-for="item in achievements"
                @mouseover="showPopAchievements($event, item)">
                <div class="cell"
                     :class="{
                        on: hasAchievements(item._id) && isAllAchieved(item),
                        lock: !hasAchievements(item._id) && !item.status
                     }">
                    <span class="photo">
                        <itam-image :src="item.icon"/>
                    </span>
                    <span class="lock"><img src="@/assets/images/ico-lock.svg"/></span>
                </div>
            </li>
            <popup v-if="showPopup" :data="popupData" :position="popupPosition"/>
        </ul>
        <div v-else class="empty-box">
            {{$t('empty.achievements')}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import popup from '@/components/popup.component.vue';
import {ACHIEVEMENTS_TYPE} from '../../../../common/config/app.config';
import {getObjectLocale} from '../../../../common/util/locale.util';
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
        ]),
    },
})
export default class Achievements extends Vue {
    @Prop() readonly simpleMode!: boolean;
    showPopup: boolean = false;
    popupPosition: any = {x: 0, y: 0};
    popupData: any = {
        name: '',
        totalStep: 0,
        description: '',
        type: ACHIEVEMENTS_TYPE.YET,
    };

    hasAchievements(id: string) {
        return !!this.$store.getters.playerAchievements[id];
    }

    isAllAchieved(item: any) {
        return this.hasAchievements(item._id) &&
            this.$store.getters.playerAchievements[item._id].histories.length >= item.achievementPerStep;
    }

    showPopAchievements($event: MouseEvent, data: any) {
        this.setPopupPosition($event);
        this.setPopupData(data);
        this.showPopup = true;
    }

    setPopupData(data: any) {
        const id: string = data._id;
        const step: number = data.achievementPerStep;
        const {name, description}: any = getObjectLocale(data.achievementInfo);
        const playerAchievements = this.$store.getters.playerAchievements;

        if (playerAchievements[id]) {
            this.popupData = playerAchievements[id];
        } else {
            this.popupData = data;
        }

        this.popupData.name = name;
        this.popupData.totalStep = step;
        this.popupData.description = description;
        this.popupData.type = this.getAchievementsType(data);
    }

    setPopupPosition($event: MouseEvent) {
        const target: HTMLElement | any = $event.currentTarget;
        const nodeBundleNum: number = this.simpleMode ? 4 : 8;
        const nodeWidth: number = target.offsetWidth;
        const nodes: any = Array.prototype.slice.call(document.querySelector('.achievements-list')!.children);
        const index: number = nodes.indexOf(target);

        this.popupPosition.y = Math.floor(index / nodeBundleNum + 1) * nodeWidth - 47;
        this.popupPosition.x = (index % nodeBundleNum + 1) * nodeWidth - 50;
    }

    getAchievedCount() {
        const playerAchievements = this.$store.getters.playerAchievements;
        const count: number = Object.keys(playerAchievements).filter((key: string) => {
            return playerAchievements[key].isDone === 'done';
        }).length;

        return count;
    }

    getAchievementsType(achievements: any) {
        if (this.hasAchievements(achievements._id)) {
            if (this.isAllAchieved(achievements)) {
                return ACHIEVEMENTS_TYPE.CLEAR;
            } else {
                return ACHIEVEMENTS_TYPE.YET;
            }
        } else {
            return ACHIEVEMENTS_TYPE.SEAL;
        }
    }
}
</script>
