<template>
    <transition name="fade">
        <div class="eosModal">
            <ul class="skakeList">
                <li class="row">
                    <span class="tit">Unstaked</span>
                    <span class="eos">{{balance.unstaked.eos | eos}}</span>
                </li>
                <li class="row">
                    <span class="tit">Refund</span>
                    <span class="eos">{{balance.refund.eos | eos}}</span>
                </li>
                <li class="row">
                    <span class="tit">Stake</span>
                    <span class="eos">{{balance.staked.eos | eos}}</span>

                </li>
            </ul>

            <div class="cpu-box">
                <ul class="cpu-box-list">
                    <li class="row">
                        <span class="tit">CPU({{resource.cpu.rate}}%)</span>
                        <span class="eos">{{resource.cpu.used}}㎲ / {{resource.cpu.max | millisecond}}ms ({{resource.cpu.eos}})</span>
                        <div class="clear"></div>

                        <div class="eosbar">
                            <span :style="{ width: `${resource.cpu.rate}%` }"></span>
                        </div>
                    </li>
                    <li class="row">
                        <span class="tit">Bandwidth ({{resource.bandwidth.rate}}%)</span>
                        <span class="eos">
                            {{resource.bandwidth.used | kilobyte}}KB /
                            {{resource.bandwidth.max | kilobyte}}KB
                            ({{resource.bandwidth.eos}})
                        </span>
                        <div class="clear"></div>

                        <div class="eosbar">
                            <span :style="{ width: `${resource.bandwidth.rate}%` }"></span>
                        </div>
                    </li>
                    <li class="row">
                        <span class="tit">RAM ({{resource.ram.rate}}%)</span>
                        <span class="eos">{{resource.ram.used | kilobyte}}KB / {{resource.ram.max | kilobyte}}KB</span>
                        <div class="clear"></div>

                        <div class="eosbar">
                            <span :style="{ width: `${resource.ram.rate}%` }"></span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="align-center">
                <button type="button" class="btn js-closeEosModal"
                        @click="close">
                    <span>{{$t('button.close')}}</span>
                </button>
            </div>

        </div><!--// eos 정보 상세 -->
    </transition>
</template>

<script lang="ts">
import {Component, Vue, Emit} from 'vue-property-decorator';
import {mapGetters} from 'vuex';

@Component({
    computed: {
        ...mapGetters([
            'balance',
            'resource',
        ]),
    },
    components: {
    },
})
export default class EosModal extends Vue {
    /* tslint:disable */
    @Emit() close() {}
    /* tslint:enable */
}
</script>