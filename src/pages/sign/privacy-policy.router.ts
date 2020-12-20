import privacyPolicy from './privacy-policy.page.vue';

export default [
    {
        path: 'sign/privacy-policy',
        name: 'privacy-policy',
        component: privacyPolicy,
        scrollBehavior() {
            return { x: 0, y: 0 };
        },
    },
];
