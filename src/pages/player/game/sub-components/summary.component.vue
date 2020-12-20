<template>
    <div class="board">
        <div class="digital row">
            <digital-assets />
            <a class="more-btn" @click="changeTab('digital-assets')">{{$t('button.more')}}</a>
        </div>
        <div class="col-row">
            <div class="achievements col-1-2">
                <a class="more-btn" @click="changeTab('achievements')">{{$t('button.more')}}</a>
                <achievements :simple-mode="true"/>
            </div><!--
            --><div class="rank col-1-2">
                <a class="more-btn" @click="changeTab('rank')">{{$t('button.more')}}</a>
                <rank :simple-mode="true"/>
            </div><!--// 리더보드 -->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import achievements from './achievements.component.vue';
import rank from './rank.component.vue';
import digitalAssets from './digital-assets.component.vue';

@Component({
    components: {
        achievements,
        rank,
        digitalAssets,
    },
})
export default class Summary extends Vue {
    @Emit()
    changeTab(tab: string) {
        return tab;
    }
}
</script>
