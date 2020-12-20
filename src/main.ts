import Vue from 'vue';
import App from './App.vue';
import router from '@/pages/index.ts';
import store from './store';
import i18n from '@/common/i18n';
import '@/filters';
import { ERROR_CODE, ERROR_MSG } from '@/common/config/error.config';
import CS from '@itamgames/customer-service';
import Maintenance from './pages/maintenance/maintenance.page.vue';

Vue.use(CS);

const main = async () => {
    Vue.config.productionTip = false;
    Vue.config.errorHandler = (err: Error, context): void => {
        if (err.toString().indexOf(ERROR_MSG.NOT_FOUND_ACCOUNT) <= 0 || !err.toString().includes('CLOSE_POPUP')) {
            router.push({name: 'error', query: {code: ERROR_CODE.ERROR_500}});
        }
        store.dispatch('hideLoadingDim');
    };

    new Vue({
        router,
        store,
        i18n,
        // render: (h) => h(App),
        render: (h) => h(Maintenance),
    }).$mount('#app');
};

main();
