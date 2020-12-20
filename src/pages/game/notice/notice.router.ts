import notice from './notice.pages.vue';
import view from './notice.view.pages.vue';

export default [
    {
        path: 'notice',
        name: 'notice',
        component: notice,
    },
    {
        path: 'notice/:notice',
        name: 'notice-view',
        component: view,
    },
];
