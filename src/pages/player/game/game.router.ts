import game from './game.pages.vue';

export default [
    {
        path: 'game/:game',
        name: 'player-game',
        component: game,
    },
];
