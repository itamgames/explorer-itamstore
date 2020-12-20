<template>
    <ul>
        <li>
            <label>{{$t('signup.email')}}</label>
            <div class="form-group">
                <input id="email" ref="email_address" type="text" v-model="email"
                       :placeholder="$t('signup.email')" :disabled="isVerifycode">
                <button type="button" class="btn js-check" @click="sendVerificationCode"
                        :disabled="isVerifycode">
                    <span>{{isVerifycode ? $t('signup.confirm') : $t('signup.verify')}}</span>
                </button>
            </div>
        </li>
        <li v-show="showCode">
            <label for="confim">{{$t('signup.emailCode')}}</label>
            <div class="form-group">
                <input id="confim" ref="confim" type="text" class="confirmnumber" v-model="code" placeholder=""
                       :disabled="isVerifycode">
                <span class="timer">
                            {{verifyTime.min | formatNumber}}:{{verifyTime.sec | formatNumber}}
                        </span>
                <button type="button" class="btn js-check" :disabled="isVerifycode" @click="emailVerification">
                    <span>{{isVerifycode ? $t('signup.confirm') : $t('signup.verify')}}</span>
                </button>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {CommonAxiosService} from '../../../common/service/common-axios.service';
import { checkPassword, checkId, checkEmail } from '@/common/util/validate.util';

@Component
export default class EmailFeild extends Vue {
    isVerifycode: boolean = false;
    verifyTime: any = {sec: 0, min: 3};
    email: string = '';
    code: string = '';
    timer: any;
    showCode: boolean = false;
    modalMessage: any = {};
    isShowModal: boolean = false;

    async sendVerificationCode() {
        if (!checkEmail(this.email)) {
            this.email = '';
            this.isShowModal = true;
            this.$emit('sendMessage', {
                title: this.$t('signup.failVerify'),
                content: this.$t('signup.needEmail'),
            });
            (this.$refs.email_address as HTMLElement).focus();
            return;
        }

        try {
            this.$store.dispatch('showLoadingDim');
            const vaild = await CommonAxiosService.Instance.post('/email/verification', {
                userEmail: this.email,
                type: 'sign-up',
                division: 'itam',
            });

            if (vaild) {
                this.successEmailValid();
            } else {
                this.handleUnknowError();
            }
        } catch (error) {
            this.handleError(error);
            this.email = '';
        } finally {
            this.$store.dispatch('hideLoadingDim');
            this.isShowModal = true;
        }
    }

    successEmailValid() {
        this.$emit('sendMessage', {
            title: this.$t('signup.sendEmail'),
            content: this.$t('signup.sendCode'),
        });
        this.runVerfiyTimer();
    }

    async emailVerification() {
        try {
            this.$store.dispatch('showLoadingDim');
            const confirm = await CommonAxiosService.Instance.post('/email/confirmation', {
                userEmail: this.email,
                code: this.code,
                division: 'itam',
            });

            if (confirm) {
                this.successEmailConfirm();
            } else {
                this.errorEmailConfirm();
            }
        } catch (error) {
            if (error.name) {
                this.errorEmailConfirm(error);
            } else {
                this.handleUnknowError();
            }

            this.isVerifycode = false;
        } finally {
            this.$store.dispatch('hideLoadingDim');
            this.isShowModal = true;
            clearInterval(this.timer);
        }
    }

    successEmailConfirm() {
        this.$emit('sendMessage', {
            title: this.$t('signup.successVerify'),
            content: this.$t('signup.successVerifyContent'),
        });

        this.isVerifycode = true;
        this.$emit('setEmail', {email: this.email, valid: this.isVerifycode});
    }

    errorEmailConfirm(error?) {
        const message: any = {title: this.$t('signup.failVerify')};

        if (error) {
            message.content = error.message;
        } else {
            message.content = this.$t('signup.failVerifyContent');
        }

        this.$emit('sendMessage', message);
        this.isVerifycode = false;
    }

    handleError(error: any) {
        if (error.name) {
            this.$emit('sendMessage', {
                title: this.$t('signup.failVerify'),
                content: error.message,
            });
        } else {
            this.handleUnknowError();
        }
    }

    handleUnknowError() {
        this.$emit('sendMessage', {
            title: '',
            content: this.$t('error.descript_500'),
        });
    }

    runVerfiyTimer() {
        clearInterval(this.timer);
        let totalTime: number = 1000 * 60 * 3;
        this.showCode = true;

        this.timer = setInterval(() => {
            totalTime -= 1000;
            const min = Math.floor(totalTime / 60 / 1000);
            const sec = (totalTime - (min * 60 * 1000)) / 1000;
            this.verifyTime.sec = Math.floor(sec);
            this.verifyTime.min = Math.floor(min);
        }, 1000);

        setTimeout(() => {
            this.showCode = false;
            this.isVerifycode = false;
            clearInterval(this.timer);
        }, totalTime);
    }
}
</script>

<style scoped>

</style>
