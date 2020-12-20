<template>
    <div class="popup player-achievements"
         :class="{ yet: data.type !== 'clear' }"
         :style="{
                top: `${position.y}px`,
                left: `${position.x}px`}">
        <div v-if="data.status === false">
            {{$t('achievements.seal')}}
        </div>
        <div v-else>
            <h4>
                {{data.name}}
                <span class="nick" v-if="data.nickname && data.nickname !== ''">{{ data.nickname }}</span>
            </h4>
            <div class="level" v-if="data.type !== 'clear' && data.type !== 'seal' && data.totalStep">
                {{data.histories.length}}/{{data.totalStep}}{{$t('popup.step')}}
            </div>
            <div class="ment" v-if="data.description">
                {{ data.description }}
            </div>
            <div v-if="data.type === 'clear'" class="list">
                <ul>
                    <li v-for="(item, index) in data.histories"
                        :class="{error: index + 1 > data.totalStep}">
                        <div class="date">
                        <span v-if="Number.isInteger(data.totalStep)">
                            {{index + 1}}/{{data.totalStep}}{{$t('achievements.step')}}
                        </span>
                            {{item.blockCreateAt | convertDateFormat}}
                        </div>
                        <div class="note">
                        <span class="transaction-id btn">
                           <a :href="`https://bloks.io/transaction/${item.transactionId}`" target="_blank">{{item.transactionId}}</a>
                        </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div><!--// 업적 pop -->
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Popup extends Vue {
    @Prop() readonly data!: any;
    @Prop() readonly position!: any;

    isError(index: number) {
        const data = this.data;
        return data.type === 'clear' &&
            data.isDone === 'error' &&
            index <= data.histories.length - data.totalStep;
    }
}
</script>

<style scoped>

</style>
histories
