<template>
    <ul>
        <li>
            <button @click="prevPage"
                    class="arrow"
                    :disabled="Math.ceil(page / max) === 1"
                    :class="{on: Math.ceil(page / max) > 1}">
                <i class="icon icon-arrow-left-thick"></i>
            </button>
        </li>
        <li v-for="n in length" :key="n" @click="changePage(n)">
            <button class="number"
                  :class="{on: n === page}">{{ n }}</button>
        </li>
        <li>
            <button class="arrow"
                    :disabled="Math.ceil(total / size / max) <= Math.ceil(page / size) || Math.ceil(total / size) < max"
                    :class="{on: Math.ceil(total / size / max) > Math.ceil(page / size) && Math.ceil(total / size) > max}"
                    @click="nextPage">
                <i class="icon icon-arrow-right-thick"></i>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Vue, Prop, Emit, Watch} from 'vue-property-decorator';
import {PAGINATION} from '../common/config/app.config';

@Component
export default class Pagination extends Vue {
    @Prop() readonly total!: number;
    @Prop() readonly page!: number;
    max: number = PAGINATION.MAX;
    size: number = PAGINATION.SIZE;
    length: number[] = [];

    mounted() {
        const totalPageNum: number = Math.ceil(this.total / this.size);
        const lastPageNum: number = totalPageNum > this.max ? this.max : totalPageNum;
        for (let i = 1; i <= lastPageNum; ++i) {
            this.length.push(i);
        }
    }

    @Emit()
    changePage(page: number) {
        return page;
    }

    prevPage() {
        const prevPage: number = Math.ceil(this.page / this.max - 1) * this.max;
        this.changePage(prevPage);
        this.length = this.getLength(prevPage + 1 - this.max);
    }

    nextPage() {
        const nextPage: number = Math.ceil(this.page / this.max) * this.max + 1;
        this.changePage(nextPage);
        this.length = this.getLength(nextPage);
    }

    getLength(startPageNum: number) {
        const range: number[] = [];
        const maxPageNum: number = Math.ceil(this.total / this.size);
        const lastPageNum: number = startPageNum + this.max - 1;

        for (let i = startPageNum; i <= lastPageNum && i <= maxPageNum; ++i) {
            range.push(i);
        }

        return range;
    }

    @Watch('total')
    update() {
        this.length = [];
        const totalPageNum: number = Math.ceil(this.total / this.size);
        const lastPageNum: number = totalPageNum > this.max ? this.max : totalPageNum;
        for (let i = 1; i <= lastPageNum; ++i) {
            this.length.push(i);
        }
    }
}
</script>
