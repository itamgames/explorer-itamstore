<template>
    <div>
        <h4>ITAM GAMES</h4>
        <table class="game-list">
            <colgroup>
                <col style="width: 70px" />
                <col />
                <col style="width: 70px" />
                <col style="width: 80px" />
            </colgroup>
            <tr v-for="(game, key, index) in gameList"
                v-if="index < 5"
                @click="goGamePage(game._id)">
                <th>
                    <itam-image :src="$options.filters.gameIcon(key)"/>
                </th>
                <td class="align-left">
                    <b>{{$options.filters.gameTitle(game._id)}}</b>
                </td>
                <td>
                    <span>{{$t('category')[gameCategory[game.storeInfo.categoryId]]}}</span>
                <td>
                    <h6>{{$t('home.transcation')}}</h6>
                    <p>{{game.transactionCount === undefined ? 0 : game.transactionCount}}</p>
                    <p v-if="game.spaceRiderCount" style="color: red">({{game.spaceRiderCount}})</p>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    components: {
        itamImage,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'gameCategory',
        ]),
    },
})
export default class Games extends Vue {
    selectedLocale: string = this.$store.getters.locale;

    goGamePage(game: string) {
        this.$router.push({name: 'game', params: {game}});
    }

    @Watch('$route.params.lang')
    beforRouteUpdate() {
        this.selectedLocale = this.$store.getters.locale;
    }
}
</script>

<style scoped>

</style>
