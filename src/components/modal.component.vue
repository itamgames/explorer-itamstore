<template>
     <div>
         <div @click="maskClose" class="mask" :class="{sub: isSubModal}"></div>
         <div class="modal" :class="{sub: isSubModal}">
             <slot></slot>
             <button type="button" @click="close" v-if="closeButton" class="btn js-close">
                 <span><i class="icon icon-close"></i></span>
             </button>
         </div>
     </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
    @Prop({default: true}) readonly autoClose!: boolean;
    @Prop({default: true}) readonly closeButton!: boolean;
    @Prop({default: true}) readonly noMaskClose!: boolean;
    @Prop({default: false}) readonly isSubModal!: boolean;

    close() {
        this.$store.dispatch('closeNotSearchModal');
        this.$emit('afterClose');
    }

    maskClose() {
        if (this.noMaskClose || this.autoClose) {
            this.close();
        }
    }
}
</script>
