<template>
    <div class="games notice box" v-if="selectedNotice && notice">
        <div class="notice-head row">
            <div class="notice-head__title fL">
                <h3>{{notice.title}}</h3>
                <p>{{$t('notice.writer')}} : {{gameList[$route.params.game].name}}</p>
            </div>
            <div class="notice-head__info fR">
                <div class="date">
                    <span>{{$t('notice.date')}} :</span>
                    {{selectedNotice.createAt | convertDateFormat}}
                </div>
            </div>
        </div>
        <hr />
        <div class="notice-contents" v-html="$options.filters.enter(notice.contents)">
        </div>
        <hr />
        <div class="notice-footer">
            <button type="button" class="btn js-back"
                    @click="$router.push({name: 'notice'})">
                <span>{{$t('notice.list')}}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {getObjectLocale} from '@/common/util/locale.util';

@Component({
    computed: {
        ...mapGetters([
            'selectedNotice',
            'gameList',
        ]),
    },
})
export default class Home extends Vue {
    notice: any = null;

    async mounted() {
        if (this.$store.getters.notices) {
            this.$store.dispatch('selectNotice', this.$route.params.notice);
        }
        if (!this.$store.getters.selectedNotice) {
            await this.initNotice();
        }
        this.notice = this.getNotification();
    }

    getNotification() {
        const getters = this.$store.getters;
        const {selectedNotice} = getters;
        const newsInfo = selectedNotice.newsInfo;

        return getObjectLocale(newsInfo);
    }

    async initNotice() {
        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getGameNotice',  this.$route.params.notice);
        this.$store.dispatch('hideLoadingDim');
    }

    @Watch('$route.params.lang')
    beforeRouteUpdate() {
        this.notice = this.getNotification();
    }
}
</script>
