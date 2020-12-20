export interface RootState {
    locales: string[];
    locale: string;
    showNotSearchModal: boolean;
    showLoadingDim: boolean;
    showLoginModal: boolean;
    showFindpassModal: boolean;
    showUserInfoModal: boolean;
    routeTransition: string;
    isPKGDownload: boolean;
    gtmEvent: string;
    downloadUrl: string;
}
