<template>
    <div>
        <h4>ITAM GAMES {{$t('home.realtime')}}</h4>
        <table v-if="records.length" class="record-list">
            <colgroup>
                <col style="width: 30%" />
                <col style="width: 30%" />
                <col style="width: 10%" />
            </colgroup>
            <tr v-for="record in records" @click="goPlayerPage(record)">
                <td>{{$options.filters.gameTitle(record.appId)}}</td>
                <td>{{record.userId}}</td>
                <td>
                    <p class="block-time">
                        {{record.blockCreateAt | convertDateFormat}}
                    </p>
                </td>
            </tr>
        </table>
        <div v-else class="empty-box">
            {{$t('empty.achievementsRecode')}}
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {MarketAxiosService} from '../../../common/service/market-axios.service';
import {INTERVAL} from '../../../common/config/app.config';

@Component({
    computed: {
        ...mapGetters([
            'achievements',
        ]),
    },
})
export default class AchievementsRecord extends Vue {
    timer!: any;
    records: any = [];
    selectedLocale: string = this.$store.getters.locale;

    async mounted() {
        this.records = await this.getAchievementsRecord();
        this.timer = setInterval(async () => {
            this.records = await this.getAchievementsRecord();
        }, INTERVAL.ACHIEVEMENTS_RECORD);
    }

    destroyed() {
        clearInterval(this.timer);
    }

    async getAchievementsRecord() {
        return await MarketAxiosService.Instance.get('get-game-achievements-record');
    }

    goPlayerPage(record: any) {
        this.$router.push({name: 'player-game', params: {id: record.userId, game: record.appId}});
    }

    @Watch('$route.params.lang')
    beforRouteUpdate() {
        this.selectedLocale = this.$store.getters.locale;
    }
}
</script>

<style scoped>

</style>