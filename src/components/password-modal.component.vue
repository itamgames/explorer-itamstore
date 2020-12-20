<template>
    <div>
        <modal @afterClose="" autoClose class="free-size findpass-box"
               :closeButton="false">
            <div class="modal-head">
                <h3>{{$t('login.findPassword')}}</h3>
                <button type="button" class="btn js-close"
                        @click="closeModal">
                    <span><i class="icon icon-close"></i></span>
                </button>
                <hr>
            </div>
            <div class="modal-body">
                <form>

                    <h5>{{$t('signup.email')}}</h5>
                    <div class="form-grop">
                        <input type="text" v-model="email" id="email" ref="email" class="email" :placeholder="$t('reserve.placeholder')"
                               :disabled="isVerifycode"/>
                        <button type="button" class="btn js-submit" @click="sendVerificationCode">
                            <span>{{isVerifycode ? $t('signup.confirm') : $t('reserve.ok')}}</span>
                        </button>
                    </div>

                    <h5>{{$t('signup.emailCode')}}</h5>
                    <div class="form-grop">
                        <input type="text" v-model="code" ref="code" class="confirmnumber" :placeholder="$t('signup.emailCode')"/>
                        <span class="timer">
                            {{verifyTime.min | formatNumber}}:{{verifyTime.sec | formatNumber}}
                        </span>
                        <button type="button" class="btn js-submit" @click="emailVerification" :disabled="isVerifycode">
                            <span>{{isVerifycode ? $t('signup.confirm') : $t('signup.verify')}}</span>
                        </button>
                    </div>
                </form>

                <div class="back">
                    <button type="button" class="btn js-login"
                            @click="showLogin">
                        <span>{{$t('login.return')}}</span>
                    </button>
                </div>
            </div>

        </modal>

        <modal v-show="isShowModal"
               class="free-size msg-modal"
               :closeButton="false"
               :isSubModal="true"
               @afterClose="afterCloseModal">
            <div class="sendmail-msg">
                <h3>{{ modalMessage.title }}</h3>
                <p v-html="modalMessage.content"></p>
                <button type="button" class="btn js-success"
                        @click="closeMessageModal">
                    <span>{{$t('reserve.ok')}}</span>
                </button>

                <button type="button" @click="closeMessageModal" class="btn js-close">
                    <span><i class="icon icon-close"></i></span>
                </button>
            </div>
        </modal><!--// 메세지 -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import modal from '@/components/modal.component.vue';
import { checkEmail } from '@/common/util/validate.util';
import {CommonAxiosService} from '../common/service/common-axios.service';
import {AccountAxiosService} from '../common/service/account-axios.service';

@Component({
    components: {
        modal,
    },
    computed: {
        ...mapGetters([]),
    },
})
export default class Findpass extends Vue {
    isShowModal: boolean = false;
    email: string = '';
    code: string = '';
    timer: any;
    verifyTime: any = {sec: 0, min: 3};
    isVerifycode: boolean = false;
    modalMessage: any = {
        title: '',
        content: '',
    };
    getFindPassword: boolean = false;

    afterCloseModal() {
        if (this.getFindPassword) {
            this.closeModal();
            this.showLogin();
            // this.isVerifycode = true;
        }
    }

    showLogin() {
        this.$store.dispatch('openNotLoginModal', true);
        this.$store.dispatch('openNotFindpassModal', false);
    }

    resetData() {
        this.email = '';
        this.code = '';
        this.isVerifycode = false;
        this.verifyTime = {sec: 0, min: 3};
        this.timer = null;
    }

    closeModal() {
        clearInterval(this.timer);
        this.resetData();
        this.$store.dispatch('openNotFindpassModal', false);
    }

    async sendVerificationCode() {
        if (!checkEmail(this.email)) {
            this.modalMessage = {
                title: this.$t('signup.failVerify'),
                content: this.$t('signup.needEmail'),
            };
            this.isShowModal = true;
            (this.$refs.email as HTMLElement).focus();
            return;
        }

        try {
            this.$store.dispatch('showLoadingDim');
            await CommonAxiosService.Instance.post(
                '/email/verification',
                {userEmail: this.email, type: 'find-password', division: 'itam'},
            );

            this.modalMessage = {
                title: this.$t('signup.sendEmail'),
                content: this.$t('signup.sendCode'),
            };

            this.runVerfiyTimer();
        } catch (e) {
            if (e.name) {
                this.modalMessage = {
                    title: this.$t(''),
                    content: e.message,
                };

                this.email = '';
                (this.$refs.email as HTMLElement).focus();
            } else {
                throw e;
            }
        } finally {
            this.$store.dispatch('hideLoadingDim');
            this.isShowModal = true;
        }
    }

    runVerfiyTimer() {
        clearInterval(this.timer);
        let totalTime: number = 1000 * 60 * 3;

        this.timer = setInterval(() => {
            totalTime -= 1000;
            const min = Math.floor(totalTime / 60 / 1000);
            const sec = (totalTime - (min * 60 * 1000)) / 1000;
            this.verifyTime.sec = Math.floor(sec);
            this.verifyTime.min = Math.floor(min);
        }, 1000);

        setTimeout(() => {
            this.code = '';
            this.modalMessage = {
                title: '',
                content: this.$t('error.timeout_code'),
            };
            this.isVerifycode = false;
            this.isShowModal = true;
            this.verifyTime = {sec: 0, min: 3};
            clearInterval(this.timer);
        }, 1000 * 60 * 3);
    }

    async emailVerification() {
        try {
            this.$store.dispatch('showLoadingDim');
            const changed = await AccountAxiosService.Instance.put('/member/reset-random-password', {
                userEmail: this.email,
                code: this.code,
            });

            if (changed) {
                this.modalMessage = {
                    title: '',
                    content: this.$t('password.temporary'),
                };
                this.getFindPassword = true;
            } else {
                this.modalMessage = {
                    title: '',
                    content: this.$t('error.descript_500'),
                };
                this.getFindPassword = true;
            }
        } catch (e) {
            this.getFindPassword = false;
            if (e.name) {
                this.modalMessage = {
                    title: this.$t('signup.failVerify'),
                    content: e.message,
                };
            } else {
                throw e;
            }
        } finally {
            this.$store.dispatch('hideLoadingDim');
            clearInterval(this.timer);
            this.isVerifycode = false;
            this.isShowModal = true;
        }
    }

    closeMessageModal() {
        this.isShowModal = false;
        this.isVerifycode = false;
        this.afterCloseModal();
    }

}
</script>
