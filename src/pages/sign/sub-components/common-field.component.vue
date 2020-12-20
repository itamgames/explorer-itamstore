<template>
    <ul>
        <li class="check signup-checkbox">
            <div class="read-terms">
                <label>
                    <input type="checkbox" ref="agree" v-model="agree" @change="updateAgree"/>
                    <img alt="agree" v-if="agree" src="@/assets/images/ico-check-on.svg" />
                    <img alt="disagree" v-else src="@/assets/images/ico-check-off.svg" />
                    <span>{{$t('agree.all')}}</span> &nbsp;
                    <span class="red">({{$t('input.required')}})</span>
                </label>
                <a href="https://web-view.itam.games/ko/privacy-policy" target="_blank">
                    <span>{{$t('agree.personal_info')}}</span>
                    <i class="icon icon-arrow-right"></i>
                </a>
                <a href="https://web-view.itam.games/ko/terms-service" target="_blank">
                    <span>{{$t('agree.itam')}}</span>
                    <i class="icon icon-arrow-right"></i>
                </a>
            </div>
        </li>
        <li>
            <label for="referral">
                <b>{{$t('signup.referral')}}</b> &nbsp;
                <small>({{$t('input.optional')}})</small>
            </label>
            <div class="form-group">
                <input id="referral"
                       type="text"
                       v-model="referral"
                       @change="$emit('setReferral', {referral: referral, valid:isVerifyReferral})"
                       :disabled="isVerifyReferral"
                       :placeholder="$t('referral.placeholder')">
                <button type="button"
                        class="btn js-check"
                        :disabled="isVerifyReferral || referral.length === 0"
                        @click="checkReferral">
                    <span>{{isVerifyReferral ? $t('signup.confirm') : $t('signup.verify')}}</span>
                </button>
            </div>
        </li>

    </ul>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {AccountAxiosService} from '../../../common/service/account-axios.service';
import {checkEmail} from '../../../common/util/validate.util';

@Component
export default class ReferralField extends Vue {
    @Prop() readonly referralId!: string;
    referral: string = '';
    agree: boolean = false;
    isVerifyReferral: boolean = false;

    created() {
        this.referral = this.referralId;
    }

    updateAgree() {
        this.$emit('setAgree', this.agree);
    }

    async checkReferral() {
        this.$store.dispatch('showLoadingDim');
        try {
            let url: string = '';
            if (checkEmail(this.referral)) {
                url = `/sign/exists-email?userEmail=${this.referral}`;
            } else {
                url = `/sign/exists-eos-account?account=${this.referral}`;
            }
            await AccountAxiosService.Instance.get(url);
            this.handleSuccess();
        } catch (error) {
            this.handleError(error);
        } finally {
            this.$store.dispatch('hideLoadingDim');
        }
    }

    handleSuccess() {
        this.$emit('setReferral', {referral: this.referral, valid: true});
        this.$emit('sendMessage', {
            title: '',
            content: this.$t('signup.successVerify'),
        });
        this.isVerifyReferral = true;
    }

    handleError(error: any) {
        if (error.name) {
            this.$emit('sendMessage', {
                title: this.$t('signup.failVerify'),
                content: error.message,
            });
        } else {
            this.$emit('sendMessage', {
                title: '',
                content: this.$t('error.descript_500'),
            });
        }

        this.$emit('setReferral', {referral: '', valid: false});
        this.isVerifyReferral = false;
    }
}
</script>
