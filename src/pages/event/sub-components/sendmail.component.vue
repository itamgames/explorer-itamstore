<template>
    <div class="sendmail">
        <form v-if="!isReserve">
            <input type="text"
                   ref="email"
                   @keyup="changeForm"
                   v-model="emailAdress"
                   :disabled="userInfo.userId && !isReserve"
                   :placeholder="$t('reserve.placeholder')"/>
            <button type="button" class="btn js-send"
                    :disabled="disabled"
                    @click="sendMaile">
                <span>{{$t('reserve.btn')}}</span>
            </button>
            <br/>
            <label>
                <input type="checkbox"
                       @change="changeForm"
                       v-model="agree"> &nbsp;
                <span v-html="$t('reserve.personal')"></span>
            </label>
        </form>

        <modal v-show="isShowModal" class="free-size" :closeButton="false">
            <div class="sendmail-msg">
                <h3>{{ msgModal.title }}</h3>
                <p v-html="msgModal.script"></p>

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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import modal from '@/components/modal.component.vue';
import { checkEmail } from '../../../common/util/validate.util';
import { EventAxiosService } from '../../../common/service/event-axios.service';
import { JwtService } from '../../../common/service/jwt.service';

@Component({
    components: {
        modal,
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
})
export default class Sendmail extends Vue {
    @Prop() readonly gamename!: string;
    @Prop() readonly appId!: string;

    isShowModal: boolean = false;
    isReserve: any = false;
    emailAdress: string = this.$store.getters.userInfo.userEmail || '';
    agree: boolean = false;
    disabled: boolean = true;

    msgModal: any = {
        title: '',
        script: '',
    };

    async created() {
        if (JwtService.get()) {
            this.isReserve = await EventAxiosService.Instance.get('check-advanced-reservation', {params: {
                appId: this.appId, email: this.$store.getters.userInfo.userEmail,
            }});
        }
    }

    @Watch('$store.getters.userInfo', {deep: true})
    async updateID(userInfo: any) {
        if (JwtService.get() && userInfo.userId) {
            if (!this.isReserve) {
                this.emailAdress = userInfo.userEmail;
            }

            this.isReserve = await EventAxiosService.Instance.get('check-advanced-reservation', {params: {
                    appId: this.appId, email: userInfo.userEmail,
                }});

            if (!this.isReserve) {
                this.emailAdress = userInfo.userEmail;
            }
        } else {
            this.isReserve = false;
            this.emailAdress = '';
        }
    }

    async changeForm() {
        if (this.emailAdress && checkEmail(this.emailAdress) && this.agree) {
            this.disabled = false;
        } else {
            this.disabled = true;
        }
    }

    // 이메일 발송
    async sendMaile() {
        const result = await EventAxiosService.Instance.post('advance-reservation-email', {
            appId: this.appId,
            email: this.emailAdress,
        });

        if (result) {
            this.msgModal.title = this.$t('reserve.sendOkTitle');
            this.msgModal.script = this.$t('reserve.sendOkScript');

        } else {
            this.msgModal.title = this.$t('reserve.sendOverlapTitle');
            this.msgModal.script = this.$t('reserve.sendOverlapScript');
        }

        this.emailAdress = '';
        this.agree = false;
        this.isShowModal = true;
        if (JwtService.get()) {
            this.isReserve = true;
        }
    }

    // 이메일 발송 성공 확인 메세지창 종료
    closeModal() {
        this.isShowModal = false;
    }
}
</script>
