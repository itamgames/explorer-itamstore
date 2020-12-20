<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GoogleAuthService } from '@/common/service/google-auth.service';
import { FacebookAuthService } from './common/service/facebook-auth.service';
import { KakaoAuthService } from './common/service/kakao-auth.service';
import { JwtService } from '@/common/service/jwt.service';

@Component
export default class App extends Vue {
    async created() {
        window.fbAsyncInit = async () => {
            await FacebookAuthService.Instance.init();
            this.$store.commit('facebookLoaded');
        };

        window.onload = async () => {
            KakaoAuthService.Instance.init();
            await GoogleAuthService.Instance.init();
            this.$store.commit('googleLoaded');
        };

        if (JwtService.get()) {
            this.$store.dispatch('getUserReferralInfo');
        }
    }
}
</script>

<style lang="scss">
  @import '~@itamgames/customer-service/dist/style.css';
  @import "./assets/icons/style.css";
  @import './assets/styles/app.scss';
</style>
