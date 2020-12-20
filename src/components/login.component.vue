<template>
    <div>
        <modal v-if="$store.state.showLoginModal" @afterClose="closeModal" autoClose class="free-size login-box"
               :closeButton="false">
            <div class="modal-head">
                <h3>{{$t('login.login')}}</h3>
                <button type="button" class="btn js-close"
                        @click="closeModal">
                    <span><i class="icon icon-close"></i></span>
                </button>
                <hr>
            </div>
            <div class="modal-body">
                <form>
                    <input type="text" v-model="user.id" :placeholder="$t('referral.placeholder')"/>
                    <input type="password" v-model="user.pass" :placeholder="$t('login.password')"/>
                    <button type="button" class="btn js-submit" @click="itamLogin">
                        <span>{{$t('login.login')}}</span>
                    </button>
                    <p v-if="error">{{error}}</p>
                </form>

                <ul class="col-row sign">
                    <li class="col-1-2">
                        <button type="button" class="btn js-signup"
                                @click="goSignup">
                            <span>{{$t('signup.signup')}}</span>
                        </button>
                    </li>
                    <li class="col-1-2">
                        <button type="button" class="btn js-findpass"
                                @click="showFindPass">
                            <span>{{$t('login.findPassword')}}</span>
                        </button>
                    </li>
                </ul>

                <div v-if="$route.params.lang !== 'hans'">
                    <div class="or">
                        <hr>
                        <span>or</span>
                        <hr>
                    </div>

                    <div class="social">
                        <h4>{{$t('login.sns')}}</h4>
                        <button type="button" class="js-social js-facebook">
                            <img alt="facebook" src="@/assets/images/ico-facebook.png" @click="facebookLogin"/>
                        </button>
                        <button type="button" class="js-social js-google">
                            <img alt="google" src="@/assets/images/ico-google.png" @click="googleLogin"/>
                        </button>
                        <button type="button" class="js-social js-kakao" @click="kakaoLogin">
                            <img alt="kakao" src="@/assets/images/icon-kakaotalk.png"/>
                        </button>
                    </div>
                </div>
            </div>
        </modal>
        <modal v-show="isShowModal"
               @afterClose="closeFailModal"
               class="free-size msg-modal">
            <div class="sendmail-msg">
                <h3 v-if="modalMessage.title">{{ modalMessage.title }}</h3>
                <p v-html="modalMessage.content"></p>
                <button type="button" class="btn js-success"
                        @click="modalOk()">
                    <span>{{$t('reserve.ok')}}</span>
                </button>

                <button type="button" @click="closeFailModal" class="btn js-close">
                    <span><i class="icon icon-close"></i></span>
                </button>
            </div>
        </modal><!--// 메세지 -->
    </div>

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { GoogleAuthService } from '../common/service/google-auth.service';
import { FacebookAuthService } from '@/common/service/facebook-auth.service';
import { KakaoAuthService } from '../common/service/kakao-auth.service';
import modal from '@/components/modal.component.vue';
import {SnsMember} from '../index';

@Component({
    components: {
        modal,
    },
    computed: {
        ...mapGetters([]),
    },
})
export default class Login extends Vue {
    user: any = {id: '', pass: ''};
    isShowModal: boolean = false;
    modalMessage: any = {
        title: '',
        content: '',
    };
    error: any = '';
    modalType: string = '';

    modalOk() {
        if (this.modalType === 'eostock') {
            window.open('https://eostock.io/', '_blank');
        } else if (this.modalType === 'sign') {
            this.goSignup();
        }

        this.isShowModal = false;
    }

    goSignup() {
        this.$store.dispatch('openNotLoginModal', false);
        this.isShowModal = false;
        this.$router.push({name: 'signup'});
    }

    showFindPass() {
        this.$store.dispatch('openNotFindpassModal', true);
        this.$store.dispatch('openNotLoginModal', false);
    }

    closeModal() {
        this.user = {};
        this.$store.dispatch('openNotLoginModal', false);
    }

    closeFailModal() {
        this.isShowModal = false;
    }

    async itamLogin() {
        try {
            this.$store.dispatch('showLoadingDim');
            await this.$store.dispatch('itamLogin', {userEmail: this.user.id, password: this.user.pass});
            this.closeModal();
            this.$router.push({name: 'home'});
        } catch (error) {
            this.openSignErrorModal(error);
        } finally {
            this.$store.dispatch('hideLoadingDim');
        }
    }

    async googleLogin() {
        const account: SnsMember = await GoogleAuthService.Instance.login();
        this.snsLogin(account);
    }

    async kakaoLogin() {
        const account: SnsMember = await KakaoAuthService.Instance.login();
        this.snsLogin(account);
    }

    async facebookLogin() {
        const account: SnsMember = await FacebookAuthService.Instance.login();
        this.snsLogin(account);
    }

    async snsLogin(account: SnsMember) {
        this.$store.dispatch('showLoadingDim');
        try {
            this.$store.dispatch('showLoadingDim');
            await this.$store.dispatch('socialLogin', {
                snsUserId: account.snsUserId,
                snsAccessToken: account.snsAccessToken,
                userGroup: account.userGroup,
            });

            this.closeModal();
            this.$router.push({name: 'home'});
        } catch (error) {
            if (error.name === 'CLOSE_POPUP') {
                return;
            } else {
                this.openSignErrorModal(error);
            }
        } finally {
            this.$store.dispatch('hideLoadingDim');
        }
    }

    openSignErrorModal(error: {name: string, message: string}) {
        if (error.name) {
            this.modalMessage = {
                title: this.$t('login.fail'),
                content: error.message,
            };
        } else {
            this.modalMessage = {
                title: '',
                content: this.$t('error.descript_500'),
            };
        }

        this.$store.dispatch('openNotLoginModal', false);
        this.isShowModal = true;
    }

    @Watch('user.id')
    changeId() {
        this.error = '';
    }

    @Watch('user.password')
    changePassword() {
        this.error = '';
    }
}
</script>
