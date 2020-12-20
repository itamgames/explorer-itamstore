<template>
    <div class="home">
        <div class="intro">
            <h1 v-html="$t('home').title"></h1>
            <p v-html="$t('home').script"></p>
        </div>

        <div class="wrap">
            <search/>
        </div>

        <div class="wrap">
            <div class="col-row briefing" ><!--
                --><div class="col-1-2 mb-full p-r-5">
                <games/>
            </div><!--
                --><div class="col-1-2 mb-full">
                <achievements-record/>
            </div><!--//  ITAM GAMES 실시간 업적 -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters} from 'vuex';
    import search from '@/components/search.component.vue';
    import games from './sub-components/games.component.vue';
    import achievementsRecord from './sub-components/achievements-record.component.vue';

    @Component({
        computed: {
            ...mapGetters([
                'gameList',
                'gameCategory',
            ]),
        },
        components: {
            search,
            games,
            achievementsRecord,
        },
    })
    export default class Home extends Vue {

    }
</script>

