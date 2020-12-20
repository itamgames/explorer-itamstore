interface BalanceUnit {
    eos: number | string;
    rate: number;
}

interface ResourceUnit {
    max: number;
    used: number;
    rate: number;
    eos: number | string;
}

export interface Balance {
    unstaked: BalanceUnit;
    staked: BalanceUnit;
    refund: BalanceUnit;
}

export interface Resource {
    cpu: ResourceUnit;
    bandwidth: ResourceUnit;
    ram: ResourceUnit;
}

export interface State {
    info: any;
    userGroup: string | null;
    balance: Balance | string;
    resource: Resource;
    token: string;
    achievements: any[];
    rank: any;
    totalScore: number;
    digitalAssets: {
        list: PlayerDigitalAssets[];
        total: number;
    } | null;
    nicknames: string[] | null;
}

export interface PlayerDigitalAssets {
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
