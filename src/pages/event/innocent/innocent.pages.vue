<template>
    <div class="event">
        <div class="intro"
             :style="{ backgroundImage: `url(${require('@/assets/images/event/event-innocent-intro.jpg')})` }">

        </div><!--// intro -->

        <div class="request row">
            <h2>{{$t('reserve.innocentBane')}}</h2>

            <sendMail gamename="innocent" appId="Innocent Vane"/>
        </div><!--// 사전예약 신청 -->

        <div class="contents">
            <h3>{{$t('reserve.reward')}}</h3>
            <div class="con">
                <template>
                    <h5>{{$t('reserve.duration')}}</h5>
                    <p v-html="$t('innocentBane.release')"></p>
                </template>
                <template>
                    <h5 class="point">{{$t('reserve.benefit')}}</h5>
                    <p class="point" v-html="$t('innocentBane.benefit_content')"></p>
                </template>
                <template>
                    <h5>{{$t('reserve.notice_title')}}</h5>
                    <p v-html="$t('innocentBane.notice_content')"></p>
                </template>
            </div>

            <div class="game-info">
                <h3>{{$t('game.info')}}</h3>
                <div>
                    <ul class="screenshot">
                       <li>
                           <button type="button" class="btn js-playMovie"
                                   @click="showMovie">
                               <div class="photo"><img alt="" src="@/assets/images/event/event-innocent-shot-1.jpg" /></div>
                               <span><img alt="" src="@/assets/images/event/play-btn.svg" /></span>
                           </button>
                       </li>
                       <li><div class="photo"><img alt="" src="@/assets/images/event/event-innocent-shot-2.jpg" /></div></li>
                       <li><div class="photo"><img alt="" src="@/assets/images/event/event-innocent-shot-3.jpg" /></div></li>
                    </ul>

                    <p class="copy" v-html="$t('innocentBane.content')"></p>

                    <h5>{{$t('reserve.info')}}</h5>

                    <div class="con">
                        <template>
                            <h5>{{$t('darktown.script')}}</h5>
                            <p v-html="$t('innocentBane.intro')"></p>
                        </template>
                        <template>
                            <h5>{{$t('innocentBane.feature1_title')}}</h5>
                            <p v-html="$t('innocentBane.feature1_content')"></p>
                        </template>
                        <template>
                            <h5>{{$t('innocentBane.feature2_title')}}</h5>
                            <p v-html="$t('innocentBane.feature2_content')"></p>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <div class="movie-modal" :class="{ on: isMovie }">
            <div class="mask" @click.self="closeMovie()"></div>
            <div class="modal-view">
                <div class="cell">
                    <button type="button" class="btn js-modal-close"
                            @click="closeMovie()">
                        <span><i class="material-icons">close</i></span>
                    </button>
                    <iframe width="100%" height="100%"
                            :src="playMovie"
                            frameborder="0"
                            allow="autoplay; encrypted-media"
                            allowfullscreen></iframe>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import sendMail from '../sub-components/sendmail.component.vue';

@Component({
    components: {
        sendMail,
    },
})
export default class Player extends Vue {
    isMovie: boolean = false;
    playMovie: string = '';
    movieUrl: string = 'https://www.youtube.com/embed/Pf2nkuE34I4?rel=0&autoplay=1&showinfo=0&playlist=Pf2nkuE34I4';

    showMovie() {
        this.playMovie = this.movieUrl;
        this.isMovie = true;
    }

    closeMovie() {
        this.playMovie = '';
        this.isMovie = false;
    }
}
</script>
