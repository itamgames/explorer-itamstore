<template>
    <div class="signup">
        <div class="wrap">
            <div v-html="$t('signup.privacy-policy')">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Home extends Vue {}
</script>