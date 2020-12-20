<template>
    <header class="header"
            :class="{ subOn: isSubOn }"
            @mouseleave="isSubOn = false">
        <div class="common">
            <div class="common-wrap">
                <h1 class="logo">
                    <router-link :to="`/${this.$route.params.lang}`">
                        <img alt="ITAM MARKET" src="@/assets/images/logo-market.svg" />
                    </router-link>
                </h1>
                <div class="gnb">
                    <div v-if="this.$route.params.lang != 'hans'" class="family">
                        <a :href="`https://itam.store/${$store.state.locale}`" target="_blank">STORE</a>
                        <a :href="`https://partners.itam.games/${$store.state.locale}`" target="_blank">PARTNER</a>
                        <a href="https://guide.itam.store/" target="_blank">GUIDE</a>
                    </div>
                    <div v-else class="family">
                        <a href="https://itam.store/" target="_blank">STORE</a>
                        <a href="https://partners.itam.games/" target="_blank">PARTNER</a>
                        <a href="https://guide.itam.store/" target="_blank">GUIDE</a>
                    </div>

                    <div class="language">
                        <h5 @click="isLanguageList = !isLanguageList">
                            <span>{{ selectedLocale | locale }}</span><i class="icon icon-arrow-down-light"></i>
                        </h5>
                        <ul class="list" :class="{ on: isLanguageList}">
                            <li v-for="locale in locales">
                                <button type="button" class="btn js-lang"
                                        :class="{ on: selectedLocale === locale}"
                                        @click="switchLanguage(locale)">
                                    <span>{{locale | locale}}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu">
            <div class="menu-wrap flex-box">
                <div class="topmenu" >
                    <button type="button" class="btn js-gamesOpen"
                            @click="isSubOn = !isSubOn">
                        <i class="icon icon-game-list"></i>
                        <span class="tit">GAMES</span>
                        <i class="icon icon-arrow-down-light"></i>
                        <div class="badge">N</div>
                    </button>

<!--                    <router-link :to="{name:'referral'}" class="btn js-nav">-->
<!--                        <span class="tit">EVENT</span>-->
<!--                    </router-link>-->

                    <button type="button" class="btn js-dadex">
                        <span class="tit">DADEX</span>
                        <span class="badge">soon</span>
                    </button>
                </div>
                <div class="sign">
                    <div class="view-logout">
                        <button type="button" class="btn js-login" v-if="!userInfo.userId"
                                @click="isShowLogin">
                            <span>Login</span>
                        </button>
                        <span class="line" v-if="!userInfo.userId"></span>
                        <router-link :to="{ name: 'signup'}" v-if="!userInfo.userId" class="btn js-signup">
                            <span>Sign Up</span>
                        </router-link>
                    </div>
                    <div class="view-login" v-if="userInfo.userId">

                        <span class="js-userinfo">{{userInfo.userId}}</span>

                        <button type="button" class="btn js-logout" @click="logout">
                            <span>LOGOUT</span>
                        </button>

                    </div>

                    <button type="button" class="btn js-storedown"
                            @click="openApk">
                        <div class="con">
                            <img class="ment" alt="ITAM Store BETA Download" src="@/assets/images/logo-down-all.png" />
                            <img class="code" alt="" src="@/assets/images/qr-code.png" />
                        </div>
                    </button>

                </div>

                <userinfo :rightgap="userinfoPopRight" />

                <div class="game-list" v-if="gameList">
                    <div class="wrap" v-dragscroll>
                        <ul>
                            <li v-for="game in gameList">
                                <router-link :to="{name: 'game', params: {game: game._id}}">
                                    <div class="photo">
                                        <itam-image alt="" :src="$options.filters.gameIcon(game._id)" />
                                    </div>
                                    <p>{{getGameTitle(game)}}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <loginmodal/>

        <findpass v-if="$store.state.showFindpassModal"/>

        <modalStoreAPKDownload class="free-size" />
    </header>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters} from 'vuex';
    import {dragscroll} from 'vue-dragscroll';
    import modalStoreAPKDownload from '@/components/modal-store-apk-download.component.vue';
    import itamImage from '@/components/itam-image.component.vue';
    import loginmodal from '@/components/login.component.vue';
    import findpass from '@/components/password-modal.component.vue';
    import userinfo from '@/components/userinfo.component.vue';

    @Component({
        directives: {
            dragscroll,
        },
        components: {
            itamImage,
            loginmodal,
            findpass,
            modalStoreAPKDownload,
            userinfo,
        },
        computed: {
            ...mapGetters([
                'locales',
                'locale',
                'gameList',
                'findpass',
                'userInfo',
                'facebookLoaded',
                'googleLoaded',
            ]),
        },
    })
    export default class Header extends Vue {
        donutPer: number = 32;

        isLoginModal: boolean = false;
        selectedLocale: string = this.$store.getters.locale;
        isLanguageList: boolean = false;
        isSubOn: boolean = false;
        userinfoPopRight: number = 0;

        initUserInfoPosition() {
            if (this.userinfoPopRight === 0) {
                const w: number = (this.$refs.useridbutton as HTMLElement).clientWidth;
                this.userinfoPopRight = w / 2 + 45;
            }
        }

        switchLanguage(lang: any) {
            this.selectedLocale = lang;
            this.isLanguageList = false;
            this.$router.push({name: this.$route.name, params: {lang: this.selectedLocale}});
        }

        getGameTitle(game: any) {
            const appInfo = game.storeInfo.baseAppDetailInfo;
            const title = '';

            if (appInfo[this.selectedLocale]) {
                return appInfo[this.selectedLocale].title;
            } else {
                return appInfo[game.storeInfo.baseAppLanguage].title;
            }

            return title;
        }

        toggleShowUserInfoModal() {
            this.initUserInfoPosition();
            const is = !this.$store.state.showUserInfoModal;
            this.$store.dispatch('openNotUserInfoModal', is);
        }

        isShowLogin() {
            this.$store.dispatch('openNotLoginModal', true);
        }

        logout() {
            this.$store.dispatch('logout');
        }

        openApk() {
            this.$store.commit('setGTMEvent', 'Itammarket_download_pc_top');
            this.$store.dispatch('sendGTM');
            this.$store.commit('setPKGDownloadModal', true);
        }
    }
</script>
