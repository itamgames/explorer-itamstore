<template>
    <div id="app" class="inner-body">
        <img src="../../assets/images/maintenance/itam-logo.png" alt="itam-logo" class="warning">
        <hr />
        <div style="margin: 175px; text-align: center">
            <img src="../../assets/images/maintenance/warning.png" alt="warning-logo">
            <p class="title">
                <span v-html="$t('maintenance').title" />
                <span class="title-bold" v-html="$t('maintenance').titleBold" />
                <span v-html="$t('maintenance').titleEnd" />
            </p>
            <span class="content" v-html="$t('maintenance').content" />
        </div>
    </div>
</template>
<script lang="ts">
import '@/assets/styles/maintenance.scss';
import Vue from 'vue';

export default class Maintenance extends Vue {

}
</script>
