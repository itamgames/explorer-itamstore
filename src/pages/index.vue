<template>
  <div class="app-wrap">
      <layout-header></layout-header>
      <div class="section"
           :class="{ index: Object.keys(this.$route.params).join().indexOf('game') < 0 }">
          <transition :name="$store.state.routeTransition">
            <router-view v-if="gameList"></router-view>
          </transition>
      </div>
      <customer-service :locale="this.$i18n.locale" />
      <layoutFooter></layoutFooter>
      <!-- 검색실패 메세지 -->
      <modal v-show="showNotSearchModal" class="free-size">
          <div class="notsearch-msg">
              <h3>{{$t('errorTitle.notFoundId')}}</h3>
              <p v-html="$t('errorContent.notFoundId')"></p>
          </div>
      </modal><!--// 검색실패 메세지 -->
      <loading-dim v-show="showLoadingDim"></loading-dim>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {EosService} from '@/common/service/eos.service';
import {mapGetters} from 'vuex';
import layoutHeader from '@/layout/header.component.vue';
import layoutFooter from '@/layout/footer.component.vue';
import modal from '@/components/modal.component.vue';
import loadingDim from '@/components/loading-dim.component.vue';

@Component({
    components: {
        layoutHeader,
        layoutFooter,
        modal,
        loadingDim,
    },
    computed: {
        ...mapGetters([
            'gameList',
            'showNotSearchModal',
            'showLoadingDim',
        ]),
    },
})
export default class App extends Vue {
    async created() {
        this.$store.dispatch('showLoadingDim');
        await this.$store.dispatch('getGameList');
        await this.$store.dispatch('getGameCategoryList');
        this.$store.dispatch('initSearchHistory');
        await EosService.Instance.initEOS();
        document.dispatchEvent(new Event('rendered'));
        this.$store.dispatch('hideLoadingDim');
    }
}
</script>

