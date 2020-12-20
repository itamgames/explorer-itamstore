<template>
    <div class="games box">
        <div class="row title-locale">
            <div class="DH20"></div>
            <h3>{{$t('achievements.info')}}</h3>
        </div>
        <div class="tbl gap-th sub">
            <achievements :page="page"/>
        </div>
        <pagination class="pagination2"
                    @change-page="changePage"
                    :page="page"
                    :total="achievements ? achievements.length : 1"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {mapGetters} from 'vuex';
    import achievements from '../sub-components/achievements.component.vue';
    import pagination from '@/components/pagination.component.vue';

    @Component({
        components: {
            pagination,
            achievements,
        },
        computed: {
            ...mapGetters([
                'achievements',
            ]),
        },
    })
    export default class GameAchievements extends Vue {
        page: number = 1;

        changePage(page: number) {
            this.page = page;
        }

        @Watch('$route.params.lang')
        async beforeRouteUpdate() {
            this.$store.dispatch('showLoadingDim');
            await this.$store.dispatch('getGameServiceInfo', this.$route.params.game);
            this.$store.dispatch('hideLoadingDim');
        }
    }
</script>
