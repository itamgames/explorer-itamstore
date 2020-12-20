<template>
    <div class="modal-backdrop" v-if="$store.state.isPKGDownload">
        <div class="modal modal-round">
            <div class="modal-head">
                <button type="button" class="btn js-close"
                        @click="closeModal">
                    <span><i class="icon icon-close"></i></span>
                </button>
            </div>
            <div class="modal-body modal-pkg-down">

                <h3>ITAM Store APK Download</h3>
                <div class="flex-box">
                    <div class="col-1-2">
                        <a :href="$store.state.downloadUrl"
                           @click="downloadPcAPKGTM"
                           class="down">
                            <img alt="APK Download" src="@/assets/images/js-download.png" />
                        </a>
                    </div>
                    <div class="col-1-2">
                        <div class="qrcode">
                            <img alt="APK Download qrcode" src="@/assets/images/qr-code.png" />
                        </div>
                    </div>
                </div>

                <div class="col-row">
                    <div class="col-1-2">
                        <p v-html="$t('storeAPK').pkgPc">데스크탑에 APK 다운로드</p>
                    </div>
                    <div class="col-1-2">
                        <p v-html="$t('storeAPK').pkgMb">모바일에 APK 다운로드</p>
                    </div>
                </div>

                <a href="https://itam.store/" target="_blank" class="js-storelink"
                    @click="goStoreWeb">
                    <span v-html="$t('storeAPK').goTo">ITAM Store 바로가기</span> &nbsp;
                    <i class="icon icon-right"></i>
                </a>

            </div>
        </div>
    </div><!--// Store APK Download -->
</template>

<script>
    export default {
        methods: {
            closeModal() {
                this.$store.commit('setPKGDownloadModal', false);
            },
            downloadPcAPKGTM() {
                this.$store.commit('setGTMEvent', 'Itammarket_download_apk_fordesktop');
                this.$store.dispatch('sendGTM');
            },
            goStoreWeb() {
                this.$store.commit('setGTMEvent', 'Itammarket_download_store_link');
                this.$store.dispatch('sendGTM');
            },
        },
    };
</script>
