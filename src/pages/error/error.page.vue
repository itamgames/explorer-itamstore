<template>
    <div class="home pagenotfound" v-if="gameList">
        <div class="intro">
            <h3>
                {{$route.query.code ? $t(`error.title_${$route.query.code}`) : $t(`error.title_${404}`)}}
            </h3>
            <p v-html="$route.query.code ? $t(`error.descript_${$route.query.code}`) : $t(`error.descript_${404}`)">
            </p>
        </div>

        <div class="wrap">
            <search/>
        </div>

        <div class="games-list" v-if="Object.keys(gameList).length > 0">
            <div class="games-list__list">
                <swiper  ref="gamesList" :options="swiperOption">
                    <swiper-slide  v-for="(item, key) in gameList" :key="key">
                        <router-link :to="{name: 'game', params: {game: item._id}}" class="btn js-game-link">
                            <div class="photo">
                                <itam-image alt="" :src="$options.filters.gameIcon(item._id)"/>
                            </div>
                            <div class="tit">{{$options.filters.gameTitle(item._id)}}</div>
                        </router-link>
                    </swiper-slide>

                </swiper>

                <button type="button" slot="button-prev" class="btn js-slide-prev js-slide-move flip">
                    <span><i class="icon icon-arrow-right-light"></i></span>
                </button>

                <button type="button" slot="button-next" class="btn js-slide-next js-slide-move">
                    <span><i class="icon icon-arrow-right-light"></i></span>
                </button>
            </div>

        </div>

    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import search from '@/components/search.component.vue';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import itamImage from '@/components/itam-image.component.vue';

@Component({
    computed: {
        ...mapGetters([
            'gameList',
        ]),
    },
    components: {
        search,
        swiper,
        swiperSlide,
        itamImage,
    },
})
export default class Home extends Vue {
    showSearchHelper: boolean = false;
    swiperOption: any = {
        slidesPerView: 9,
        spaceBetween: 10,
        navigation: {
            nextEl: '.js-slide-next',
            prevEl: '.js-slide-prev',
        },
    };
}
</script>
