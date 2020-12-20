import game from './game.pages.vue';
import achievements from './achievements/achievements.router';
import rank from './rank/rank.router';
import notice from './notice/notice.router';
import digitalAssets from './digital-assets/digital-assets.router';

export default [
    {
        path: 'game/:game',
        name: 'game',
        component: game,
        children: [
            ...achievements,
            ...rank,
            ...notice,
            ...digitalAssets,
        ],
        scrollBehavior() {
             return { x: 0, y: 0 };
        },
    },
];
