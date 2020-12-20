<template>
    <div class="referral">
        <div class="referral-title">
            <h1><img alt="join the referral event and earn rewards!" src="@/assets/images/event/referral/title.png" /></h1>
            <div class="summery">
                <p class="msg" v-html="$t('referral.event_summery1')">친구 초대하면 받을 수 있다. 토큰!</p>
                <p class="tokken">Total <b>108,500</b> &nbsp;<span>ITAM TOKEN</span> !!</p>
            </div>
            <div class="tokens"></div>
        </div>
        <div class="wrap">
            <div class="event-title">
                <h2>
                    <span><img alt="01" src="@/assets/images/event/referral/no-1.png" /></span>
                    <span v-html="$t('referral.event1_title')"></span>
                </h2>
                <p v-html="$t('referral.event1_content')"></p>
                <p class="point" v-html="$t('referral.event1_subContent')"></p>
            </div>
            <div class="rank">
                <ul>
                    <li class="rank1">
                         <div class="ico"><img alt="" src="@/assets/images/event/referral/coins.png" /></div>
                        <div class="coin">50,000</div>
                        <div class="unit">ITAM TOKEN</div>
                        <div class="user-rank"><b>1</b><span v-html="$t('referral').event_unit">등</span></div>
                    </li>
                    <li>
                        <div class="ico"><img alt="" src="@/assets/images/event/referral/coins.png" /></div>
                        <div class="coin">25,000</div>
                        <div class="unit">ITAM TOKEN</div>
                        <div class="user-rank">2<span v-html="$t('referral').event_unit">등</span></div>
                    </li>
                    <li>
                        <div class="ico"><img alt="" src="@/assets/images/event/referral/coins.png" /></div>
                        <div class="coin">12,500</div>
                        <div class="unit">ITAM TOKEN</div>
                        <div class="user-rank">3<span v-html="$t('referral').event_unit">등</span></div>
                    </li>
                    <li>
                        <div class="ico"><img alt="" src="@/assets/images/event/referral/coins.png" /></div>
                        <div class="coin">3,000</div>
                        <div class="unit">ITAM TOKEN</div>
                        <div class="user-rank">4-10<span v-html="$t('referral').event_unit">등</span></div>
                    </li>
                </ul>
            </div>
            <div class="event-title event2">
                <h2>
                    <span><img alt="01" src="@/assets/images/event/referral/no-2.png" /></span>
                    <span v-html="$t('referral.event2_tit')"></span>
                </h2>
                <p v-html="$t('referral.event2_summery')"></p>
            </div>
            <div class="event-reward">
                <div class="event-reward__cell">
                    <div class="event-reward__check" v-html="$t('referral.event2_title')">
                        최초 추천인 20명 달성!
                    </div>
                    <div class="event-reward__ico"><img alt="" src="@/assets/images/event/referral/event-reward_ico.png" /></div>
                    <div class="event-reward__reward">
                        <div class="con" v-html="$t('referral.event2_content')"></div>
                    </div>
                    <div class="event-reward__option" v-html="$t('referral.event2_content2')"></div>
                </div>

                <div class="event-reward__cell">
                    <div class="event-reward__check" v-html="$t('referral.event3_title')">2</div>
                    <div class="event-reward__ico"><img alt="" src="@/assets/images/event/referral/event-reward_ico.png" /></div>
                    <div class="event-reward__reward">
                        <div class="con" v-html="$t('referral.event3_content')"></div>
                    </div>
                    <div class="event-reward__option" v-html="$t('referral.event3_content2')"></div>
                </div>

                <div class="event-reward__cell">
                    <div class="event-reward__check" v-html="$t('referral.event4_title')"></div>
                    <div class="event-reward__ico"><img alt="" src="@/assets/images/event/referral/event-reward_ico.png" /></div>
                    <div class="event-reward__reward">
                        <div class="con" v-html="$t('referral.event4_content')"></div>
                    </div>
                    <div class="event-reward__option" v-html="$t('referral.event4_content2')"></div>
                </div>
            </div>

            <div class="event-members" v-if="userInfo.userId">
                <h3>{{$t('referral.list')}}</h3>
                <table class="tbl">
                    <colgroup>
                        <col style="width: 10%">
                        <col>
                        <col style="width: 20%">
                        <col style="width: 20%">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>{{$t('referral.joinDate')}}</th>
                            <th><span>{{$t('referral.event5_price')}}</span><small>(EOS)</small></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of referralList || []" :key="index">
                            <th>{{ index + 1 }}</th>
                            <td class="align-center">{{item.userId}}</td>
                            <td>{{ item.createAt | convertDateFormat}}</td>
                            <td>-</td>
                        </tr>
                        <tr v-if="referralList.length < 1">
                            <td colspan="4" class="align-center">{{$t('referral.message1')}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {JwtService} from '@/common/service/jwt.service';

@Component({
    computed: {
        ...mapGetters([
            'userInfo',
            'referralList',
        ]),
    },
})
export default class Home extends Vue {

    async created() {
        if (!this.$store.getters.referralInfo && JwtService.get()) {
            this.$store.dispatch('showLoadingDim');
            await this.$store.dispatch('getUserReferralInfo');
            this.$store.dispatch('hideLoadingDim');
        }
    }

}
</script>
