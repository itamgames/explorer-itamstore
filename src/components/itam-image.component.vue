<template>
    <img :src="$options.filters.appendURL(src)"
         v-bind="attributes"
         @error="replaceByDefault"/>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class ItamImage extends Vue {
    @Prop() readonly src!: string;
    @Prop() readonly attributes?: any;

    replaceByDefault(e) {
        e.target.src = require('@/assets/images/error-itam.png');
    }
}
</script>
