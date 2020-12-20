<template>
    <div class="signup">
        <div class="wrap">
            <h2>{{$t('signup.signup')}}</h2>
            <signup-form @sendMessage="modalHandler"></signup-form>
            <div class="social" v-if="$route.params.lang !== 'hans'">
                <div class="or">
                    <hr>
                    <span>or</span>
                    <hr>
                </div>
                <button type="button" class="btn js-social js-facebook"
                        @click="bySnsAccount('facebook')">
                    <img alt="facebook" src="@/assets/images/ico-facebook.png"/>
                    <span>Facebook {{$t('signup.social')}}</span>
                </button>
                <button type="button" class="btn js-social js-google"
                        @click="bySnsAccount('google')">
                    <img alt="google" src="@/assets/images/ico-google.png"/>
                    <span>Google {{$t('signup.social')}}</span>
                </button>
                <button type="button" class="btn js-social js-kakao"
                        @click="bySnsAccount('kakao')">
                    <img alt="kakao" src="@/assets/images/icon-kakaotalk.png"/>
                    <span>Kakaotalk {{$t('signup.social')}}</span>
                </button>
                <!--<button type="button" class="btn js-social js-wechat"-->
                        <!--@click="byFacebookAccount()">-->
                    <!--<img alt="kakao" src="@/assets/images/icon-wechat.png"/>-->
                    <!--<span>Wechat {{$t('signup.social')}}</span>-->
                <!--</button>-->
            </div>
        </div>
        <additional-modal :show="showAdditionalModal"
                          @sendMessage="modalHandler"
                          @close="showAdditionalModal = false"/>
        <modal v-if="isShowModal"
               class="free-size msg-modal"
               :closeButton="false">
            <div class="sendmail-msg">
                <h3 v-if="modalMessage.title">{{ modalMessage.title }}</h3>
                <p v-html="modalMessage.content"></p>
                <button type="button" class="btn js-success"
                        @click="closeModal">
                    <span>{{$t('reserve.ok')}}</span>
                </button>

                <button type="button" @click="closeModal" class="btn js-close">
                    <span><i class="icon icon-close"></i></span>
                </button>
            </div>
        </modal><!--// 메세지 -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GoogleAuthService } from '@/common/service/google-auth.service';
import { FacebookAuthService } from '@/common/service/facebook-auth.service';
import { KakaoAuthService } from '../../common/service/kakao-auth.service';
import {mapGetters} from 'vuex';
import signupForm from './sub-components/signup.component.vue';
import modal from '@/components/modal.component.vue';
import additionalModal from './sub-components/additional-modal.component.vue';
import {SnsMember} from '../../index';

@Component({
    computed: {
        ...mapGetters([
            'facebookLoaded',
            'googleLoaded',
        ]),
    },
    components: {
        additionalModal,
        signupForm,
        modal,
    },
})
export default class Home extends Vue {
    isShowModal: boolean = false;
    showAdditionalModal: boolean = false;
    modalMessage: any = '';
    afterClose!: any;

    created() {
        this.$store.dispatch('logout');
    }

    async bySnsAccount(sns: string) {
        try {
            let account!: SnsMember;

            switch (sns) {
                case 'facebook':
                    this.$store.dispatch('showLoadingDim');
                    account = await FacebookAuthService.Instance.login();
                    break;
                case 'google':
                    this.$store.dispatch('showLoadingDim');
                    account = await GoogleAuthService.Instance.login();
                    break;
                case 'kakao':
                    account = await KakaoAuthService.Instance.login();
            }
            this.goAdditional(account);
        } catch (error) {
            this.handleError(error);
        } finally {
            this.$store.dispatch('hideLoadingDim');
        }
    }

    handleError(error: any) {
        if (error.type === 'CLOSE_POPUP') {
            return;
        } else {
            throw error;
        }
    }

    async checkMember(account: SnsMember) {
        try {
            await this.$store.dispatch('socialLogin', account);
            return true;
        } catch (e) {
            if (e.name) {
                return false;
            } else {
                throw e;
            }
        }
    }

    async goAdditional(account: SnsMember) {
        const isMember: boolean = await this.checkMember(account);

        if (!isMember) {
            this.openAdditionalModal(account);
        } else {
            this.$router.push({name: 'home'});
        }
    }

    modalHandler(config: {title: string, content: string, afterClose?: any}) {
        this.modalMessage = config;
        this.isShowModal = true;
        this.afterClose = config.afterClose;
    }

    openAdditionalModal(params: any) {
        this.$store.commit('setAdditional', params);
        this.showAdditionalModal = true;
    }

    closeModal() {
        if (this.afterClose) {
            this.afterClose();
        }
        this.isShowModal = false;
    }
}
</script>
