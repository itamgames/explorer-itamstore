<template>
    <div v-show="$store.state.showUserInfoModal" class="userinfo-box" :style="{ right: `${rightgap}px`}"
         @mouseleave="closeModal">
        <div class="triangle">
            <div class="inner-triangle"></div>
        </div>

        <div class="userinfo-box__head">
            <button type="button" class="btn js-link"
                    @click="goReferral">
                <span>{{$t('referral.title')}}</span>
                <img alt="" src="@/assets/images/btn-more.png"/>
            </button>
        </div>
        <div class="userinfo-box__body">
            <!-- 이벤트 달성전 -->
            <div class="event-ing" v-if="referralCount < purposeNumber">
                <div class="face">
                    <div class="face-ico">
                        <img alt=""
                             :src="require(`@/assets/images/levelface-1.svg`)"
                             v-if="referralCount < 7"/>
                        <img alt=""
                             :src="require(`@/assets/images/levelface-2.svg`)"
                             v-else-if="referralCount >= 7 && referralCount <= 13"/>
                        <img alt=""
                             :src="require(`@/assets/images/levelface-3.svg`)"
                             v-else-if="referralCount >= 14 && referralCount < 20"/>
                    </div>
                    <div class="face-msg">{{message}}</div>
                </div>
                <div class="chart">
                    <!-- chart -->
                    <div class="dchart" :style="{ animationDelay: `-${referralCount / purposeNumber * 100}s` }"></div>

                    <div class="chart-info">
                        <div class="chart-info__tit">
                            {{$t('referral.my_referral')}}
                        </div>
                        <div class="chart-info__num">
                            {{ referralCount }}
                        </div>
                        <div class="chart-info__purpose">
                            <span class="chart-info__purpose-tit">{{$t('referral.goal_num')}}</span>
                            <span class="chart-info__purpose-num">{{ purposeNumber }}</span>
                        </div>
                    </div>
                </div>
                <div class="eos">
                    <ul class="col-row">
                        <li class="col-1-2">
                            <h4>
                                <span class="num">{{referralBonus || '0.0000'}}</span>
                                <span class="unit">EOS</span>
                            </h4>
                            <p>{{$t('referral.my_eos')}}</p>
                        </li>
                        <li class="col-1-2">
                            <h4>
                                {{referralRank + $t('referral.rank_unit')}}
                                <span><img alt="" src="@/assets/images/icon-up.png"></span>
                            </h4>
                            <p>{{$t('referral.my_rank')}}</p>
                        </li>
                    </ul>
                </div>
            </div><!--// 이벤트 달성전 -->

            <!-- 이벤트 달성후 -->
            <div class="event-end" v-else>
                <div class="msg">
                    <h2>{{$t('referral.goal')}}</h2>
                    <p>{{$t('referral.goal_msg')}}</p>
                    <div class="icon">
                        <img alt="" src="@/assets/images/event-end-phooto.png"/>
                    </div>
                </div>

                <div class="userinfo">
                    <dl>
                        <dt>{{$t('referral.my_referral')}}</dt>
                        <dd>
                            <span class="data">{{referralCount + $t('referral.people_num')}}</span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{{$t('referral.my_rank')}}</dt>
                        <dd>
                            <span class="data">{{referralRank + $t('referral.rank_unit')}}</span>
                            <img alt="up" src="@/assets/images/icon-up.png"/>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{{$t('referral.my_eos')}}</dt>
                        <dd>
                            <span class="data">{{referralBonus || '0.0000'}}</span>
                            <span class="unit">EOS</span>
                        </dd>
                    </dl>
                </div>
            </div><!--// 이벤트 달성후 -->

            <div class="activate">
                <a class="btn js-copy" @click="copyUrl">
                    <span>{{$t('userInfo.referral')}}</span>
                    <input type="text" style="opacity: 0" :value="`${url}/${locale}/sign/signup?referralId=${userInfo.userId}`" id="copyUrl"/>
                    <img alt="" src="@/assets/images/icon-copy.svg"/>
                </a>
                <button type="button" class="btn js-logout" @click="logout">
                    <span>LOGOUT</span>
                    <span><img alt="" src="@/assets/images/exit.svg"/></span>
                </button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';
    import { REFERRAL } from '@/common/config/env.config';

    @Component({
        components: {},
        computed: {
            ...mapGetters([
                'referralInfo',
                'referralCount',
                'referralBonus',
                'referralRank',
                'userInfo',
                'locale',
            ]),
        },
    })
    export default class Login extends Vue {
        purposeNumber: number = 20; // 추천인 목표인원
        url: string = REFERRAL.BASE_URL;
        readonly referralCount!: any;

        @Prop({default: 0}) readonly rightgap!: number;

        goReferral() {
            this.$store.dispatch('openNotUserInfoModal', false);
            this.$router.push({name: 'referral'});
        }

        get message() {
            let message: any = '1';
            const referralCount = this.$store.getters.referralCount;
            if (referralCount < 7) {
                message = this.$t('referral.message1');
            } else if (referralCount >= 7 && referralCount <= 13) {
                message = this.$t('referral.message2');
            } else if (this.referralCount >= 14 && this.referralCount < 20) {
                message = this.$t('referral.message3');
            }
            return message;
        }

        closeModal() {
            this.$store.dispatch('openNotUserInfoModal', false);
        }

        copyUrl($event: Event) {
            $event.preventDefault();
            const url: any = document.querySelector('#copyUrl');

            url.select();
            document.execCommand('copy');
            alert(this.$t('userInfo.copy'));
        }

        logout() {
            this.$store.dispatch('logout');
            this.$store.dispatch('openNotUserInfoModal', false);
        }

        @Watch('$store.state.showUserInfoModal')
        getReferral(val: boolean) {
            if (val) {
                this.$store.dispatch('getUserReferralInfo');
            }
        }
    }
</script>
