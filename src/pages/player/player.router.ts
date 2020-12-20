import player from './player.pages.vue';
import game from './game/game.router';

export default [
    {
        path: 'player/:id',
        name: 'player',
        component: player,
        children: [
            ...game,
        ],
        scrollBehavior() {
            return { x: 0, y: 0 };
        },
    },
];
