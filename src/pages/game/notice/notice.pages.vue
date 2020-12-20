<template>
    <div class="games box" v-if="notices">
        <div class="row title-locale">
            <div class="DH20"></div>
            <h3>{{$t('game.notice')}}</h3>
        </div>

        <div class="tbl sub">
            <table>
                <colgroup>
                    <col/>
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                    <col style="width: 8%" />
                </colgroup>
                <thead>
                <tr>
                    <th>
                        <div class="align-left">
                            <span class="tit">{{$t('notice.title')}}</span>
                        </div>
                    </th>
                    <th>
                        <span class="tit">{{$t('notice.writer')}}</span>
                    </th>
                    <th>
                        <span class="tit">{{$t('notice.date')}}</span>
                    </th>
                </tr>
                </thead>
                <tbody v-if="notices && notices.list.length">
                    <tr v-for="news in notices.list">
                        <th class="align-left">
                           <router-link :to="{name: 'notice-view', params:{notice: news._id}}">
                               {{ news.newsInfo | newsTitle }}
                           </router-link>
                        </th>
                        <td>{{gameList[$route.params.game].name}}</td>
                        <td>{{news.createAt | convertDateFormat}}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="3" class="empty-box">
                            {{$t('empty.notice')}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination2">
            <pagination :total="notices.total || 1"
                        @change-page="changePage"/>
        </div>

    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import pagination from '@/components/pagination.component.vue';

@Component({
    components: {
        pagination,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'notices',
        ]),
    },
})
export default class GameInfo extends Vue {
    page: number = 1;

    async created() {
        if (!this.$store.state.notices) {
            await this.$store.dispatch('getGameNotices', {appId: this.$route.params.game, page: 1});
        }
    }

    async changePage(page: number) {
        this.page = page;
        await this.getNotices();
    }

    async getNotices() {
        await this.$store.dispatch('getGameNotices', {appId: this.$route.params.game, page: this.page});
    }
}
</script>
