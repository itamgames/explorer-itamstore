import signup from './signup.pages.vue';

export default [
    {
        path: 'sign/signup',
        name: 'signup',
        component: signup,
        scrollBehavior() {
            return { x: 0, y: 0 };
        },
    },
];
