<template>
    <table>
        <colgroup>
            <col style="width: 106px" />
            <col />
            <col style="width: 20%" />
            <col style="width: 50px" />
        </colgroup>
        <thead>
        <tr>
            <th colspan="2">{{$t('game.submenuRank')}}</th>
            <th>{{$t('leaderboard.scoreEvaluation')}}</th>
            <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody v-if="leaderboardCategory">
        <tr v-for="item in leaderboardCategory">
            <th>

                <div class="photo">
                    <itamImage :attributes="{alt: $options.filters.gameService(item.leaderBoardInfo).name}"
                               :src="item ? item.icon : ''" />
                </div>
            </th>
            <td class="align-left">
                {{$options.filters.gameService(item.leaderBoardInfo).name}}
            </td>
            <td>{{$t('rank')[item.calculatorType]}}</td>
            <td>
                <router-link :to="{name: 'rank', query: {boardId: item._id}}" class="js-move">
                    <i class="icon icon-arrow-right-light"></i>
                </router-link>
            </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
            <td colspan="5" class="empty-box">
                {{$t('empty.leaderboard')}}
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    components: {
        itamImage,
    },
    computed: {
        ...mapGetters([
            'leaderboardCategory',
        ]),
    },
})
export default class Leaderboard extends Vue {}
</script>