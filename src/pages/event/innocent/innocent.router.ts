import innocent from './innocent.pages.vue';

export default [
    {
        path: 'event/innocent',
        name: 'innocent',
        component: innocent,
        children: [],
        scrollBehavior() {
            return { x: 0, y: 0 };
        },
    },
];
