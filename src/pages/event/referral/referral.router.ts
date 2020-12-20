import referral from './referral.pages.vue';

export default [
    {
        path: 'event/referral',
        name: 'referral',
        component: referral,
        children: [],
        scrollBehavior() {
            return { x: 0, y: 0 };
        },
        // beforeEnter (to, from, next) {
        // },
    },
];
