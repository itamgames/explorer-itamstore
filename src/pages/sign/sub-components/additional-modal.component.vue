<template>
    <modal v-if="show" @afterClose="close" class="free-size login-box">
        <div class="modal-head">
            <h3>약관 동의 및 추가 정보</h3>
        </div>
        <div class="modal-body sendmail-msg agree-box">
            <div class="msg">회원가입을 위해 필수 동의항목을 동의해주시기 바랍니다.</div>
            <div class="form-box">
                <email-field v-if="!additional.userEmail"
                             @setEmail="setEmail"
                             @sendMessage="sendMessage"></email-field>
                <common-field :referral="referral"
                              :agree="agree"
                              @setAgree="setAgree"
                              @setReferral="setReferral"
                              @sendMessage="sendMessage"></common-field>
                <div class="DH10"></div>
                <button type="button" class="btn js-success"
                        @click="beforeSignUp()">
                    <span>ITAM {{$t('signup.signup')}}</span>
                </button>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import modal from '@/components/modal.component.vue';
import emailField from './email-field.component.vue';
import commonField from './common-field.component.vue';
import {AccountAxiosService} from '../../../common/service/account-axios.service';

@Component({
    computed: {
        ...mapGetters([
            'additional',
        ]),
    },
    components: {
        modal,
        emailField,
        commonField,
    },
})
export default class AdditionalModal extends Vue {
    @Prop() readonly show!: boolean;
    readonly additional!: any;
    referral: string = '';
    validReferral: boolean = false;
    email: string = '';
    emailValid: boolean = false;
    agree: boolean = false;

    created() {
        this.emailValid = this.additional.userEmail ? false : true;
    }

    close() {
        this.reset();
        this.$emit('close');
    }

    reset() {
        this.email = '';
        this.referral = '';
        this.emailValid = false;
        this.agree = false;
        this.$store.commit('setAdditional', {});
    }

    setEmail({email, valid}: {email: string, valid: boolean}) {
        this.email = email;
        this.emailValid = valid;
    }

    setAgree(agree: boolean) {
        this.agree = agree;
    }

    setReferral({referral, valid}) {
        this.referral = referral;
        this.validReferral = valid;
    }

    sendMessage(config: {title: string, content: string}) {
        this.$emit('sendMessage', config);
    }

    validator() {
        if (!this.agree) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needAgree'),
            });

            return false;
        }

        if (this.referral && !this.validReferral) {
            this.$emit('sendMessage', {
                title: this.$t('signup.fail'),
                content: this.$t('signup.needReferral'),
            });

            return false;
        }

        return true;
    }

    handleUnknowError() {
        this.$emit('sendMessage', {
            title: '',
            content: this.$t('error.descript_500'),
        });
    }

    async beforeSignUp() {
        if (this.validator()) {
            try {
                await this.signUp();
            } catch (e) {
                if (e.name === 'duplicate-user') {
                    this.$emit('sendMessage', {
                        title: '',
                        content: e.message,
                    });
                } else {
                    this.handleUnknowError();
                }
            } finally {
                this.$store.dispatch('hideLoadingDim');
            }
        }
    }

    async signUp() {
        const {profileImages, snsUserId, snsAccessToken, userEmail, userGroup} = this.additional;
        const params: any = {
            userEmail: userEmail ? userEmail : this.email,
            profileImages,
            snsUserId: snsUserId.toString(),
            snsAccessToken,
        };

        if (this.referral) {
            params.referral = this.referral;
        }

        this.$store.dispatch('showLoadingDim');
        await AccountAxiosService.Instance.post(`/sign/sns-sign-up`, params);
        this.$store.dispatch('hideLoadingDim');
        // await this.$store.dispatch('socialLogin', {snsUserId, snsAccessToken, userGroup});
        this.$emit('sendMessage', {
            title: this.$t('signup.success'),
            content: this.$t('signup.successMsg'),
            afterClose: () => {
                this.$router.push({name: 'home'});
            },
        });

    }

}
</script>
