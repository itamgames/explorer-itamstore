import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {LANG} from '@/common/config/app.config';

Vue.use(VueI18n);

export default new VueI18n({
    locale: LANG.ENGLISH,
    messages: require('./i18n.json'),
});
