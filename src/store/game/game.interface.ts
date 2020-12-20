export interface Game {
    _id: string;
    userId: string; // email format
    appName: string; // app name
    totalDownloadCount?: number;
    star?: number;
    createAt: number; // timestamp
    updateAt: number; // timestamp
    status: string; // 앱 상태
}

export interface GameList {
    [id: string]: Game;
}

interface Achievements {
    _id: string;
    name: string;
    imageUrl: string;
    reward: number;
    achievedPlayer: number;
    totalPlayer: number;
}

export interface AchievementsList {
    list: Achievements[];
    total: number;
}

interface Leaderboard {
    _id: string;
    name: string;
    imageUrl: string;
    topRecord: number;
    updateAt: number;
    playerNumber: number;
}

export interface LeaderboardList {
    list: Leaderboard[];
    total: number;
}

export interface Notices {
    list: Notice[];
    total: number;
}

export interface Params {
    _id: string;
    page: number;
}

export interface Category {
    [id: string]: string;
}

export interface Notice {
    _id: string;
    appId: string;
    createAt: Date;
    updateAt: Date;
    newsInfo: {
        [lang: string]: {
            title: string;
            contents: string;
        },
    };
    writer: string;
}

export interface DigitalAssetsCategory {
    _id: string;
    digitalAssetCurrencyId: string;
    createAt: Date;
    updateAt: Date;
    categoryInfo: {
        [lang: string]: {
            name: string;
        },
    };
    appId: string;
    symbol: string;
}

export interface DigitalAssetsGroup {
    _id: string;
    digitalAssetCurrencyId: string;
    groupInfo: {
        [lang: string]: {
            name: string;
            description: string;
        },
    };
    icon: string;
    createAt: Date;
    updateAt: Date;
    categoryId: string;
    categoryName: string;
    mainnetDeploy: boolean;
    appId: string;
    symbol: string;
}

export interface DigitalAssets {
    _id: string;
    transferable: boolean;
    createAt: Date;
    appId: string;
    itemName: string;
    itemGroupId: string;
    options: {
        [name: string]: any;
    };
    userId: string;
    userGroup: string;
    reason: string;
    categoryId: string;
    symbol: string;
    histories: Array<{
        owner: string;
        owner_group: string;
        app_id: string;
        item_id: string;
        nickname: string;
        group_id: string;
        item_name: string;
        category: string;
        options: {
            [name: string]: any;
        };
        duration: number;
        transferable: number;
        state: string;
        transactionId: string;
        blockCreateAt: Date;
        createAt: Date;
    }>;
    duration: number;
}


export interface State {
    selectedGame: any | null;
    gameList: GameList | null;
    gameCategory: Category;
    achievements: AchievementsList | null;
    gameRankList: LeaderboardList | null;
    leaderboardCategory: string[];
    selectedNotice: Notice | null;
    notices: Notices | null;
    gameDefaultLocale: string;
    symbol: string;
    digitalAssetsCategorys: DigitalAssetsCategory[] | null;
    digitalAssetsGroups: DigitalAssetsGroup[] | null;
    digitalAssets: DigitalAssets[] | null;
}

