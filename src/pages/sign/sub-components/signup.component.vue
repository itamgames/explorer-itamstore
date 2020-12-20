<template>
    <form>
        <div class="form-box">
            <email-field @setEmail="setEmail"
                         @sendMessage="sendMessage"></email-field>
            <ul>
                <li>
                    <label for="password">{{$t('signup.password')}}</label>
                    <div class="form-group">
                        <input id="password" ref="password" type="password" class="pass" v-model="user.password">
                    </div>
                    <p>{{$t('signup.passwordMsg')}}</p>
                </li>
                <li>
                    <label for="repassword">{{$t('signup.passwordConfirm')}}</label>
                    <div class="form-group">
                        <input id="repassword" ref="repassword" type="password" class="pass"
                               v-model="passwordConfirm">
                    </div>
                </li>
            </ul>
            <common-field :referralId="user.referral"
                          @setAgree="setAgree"
                          @setReferral="setReferral"
                          @sendMessage="sendMessage"></common-field>
            <div class="form-submit">
                <button type="button" class="btn js-submit" @click="signUp">
                    <span>ITAM {{$t('signup.signup')}}</span>
                </button>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { AccountAxiosService } from '@/common/service/account-axios.service';
import { checkPassword, checkId, checkEmail } from '@/common/util/validate.util';
import emailField from './email-field.component.vue';
import commonField from './common-field.component.vue';

@Component({
    components: {
        emailField,
        commonField,
    },
})
export default class Signup extends Vue {
    isShowModal: boolean = false;
    showCode: boolean = false;
    code: string = '';
    isVerifycode: boolean = false;
    isVerifyReferral: boolean = false;
    verifyTime: any = {sec: '00', min: '03'};
    passwordConfirm: string = '';
    user: any = {
        userEmail: '',
        password: '',
        referral: '',
    };
    agree: boolean = false;
    modalMessage: any = {
        title: '',
        content: '',
    };

    setEmail({email, valid}: {email: string, valid: boolean}) {
        this.user.userEmail = email;
        this.isVerifycode = valid;
    }

    setAgree(agree: boolean) {
        this.agree = agree;
    }
    setReferral({referral, valid}) {
        this.user.referral = referral;
        this.isVerifyReferral = valid;
    }

    created() {
        if (this.$route.query.referralId) {
            this.user.referral = this.$route.query.referralId;
        }
    }

    sendMessage(config: {title: string, content: string}) {
        this.$emit('sendMessage', config);
    }

    validateForm() {
        if (!this.user.userEmail) {
            this.$emit('sendMessage', {
                title: this.$t('signup.failVerify'),
                content: this.$t('signup.needEmail'),
            });
            return false;
        } else if (!checkPassword(this.user.password)) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.passwordMsg'),
            });
            return false;
        } else if (this.user.password !== this.passwordConfirm) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needPassword'),
            });
            return false;
        } else if (!this.isVerifycode) {
            this.$emit('sendMessage', this.modalMessage = {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needVerify'),
            });
            return false;
        } else if (this.user.referral && !this.isVerifyReferral) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needReferral'),
            });
            this.isShowModal = true;
            return false;
        } else if (!this.agree) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needAgree'),
            });
            return false;
        }

        return true;
    }

    async signUp() {
        if (this.validateForm()) {
            this.$store.dispatch('showLoadingDim');
            try {
                const {userEmail, password, referral} = this.user;
                const params: any = {userEmail, password};
                if (referral) { params.referral = referral; }

                await AccountAxiosService.Instance.post('/sign/itam-sign-up', params);
                this.$emit('sendMessage', {
                    title: this.$t('signup.success'),
                    content: this.$t('signup.successMsg'),
                    afterClose: () => {
                        this.$router.push({name: 'home'});
                    },
                });
            } catch (e) {
                const content = 'signup.' + (e.name === 'exist_user_id' ? e.name : 'failMsg');
                this.$emit('sendMessage', {
                    title: this.$t('signup.fail'),
                    content: this.$t(content),
                });
            } finally {
                this.$store.dispatch('hideLoadingDim');
            }
        }
    }

    @Watch('user.referral')
    changeReferral() {
        this.isVerifyReferral = false;
    }

}
</script>
