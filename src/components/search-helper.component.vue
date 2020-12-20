<template>
    <div class="search-helper">
        <div class="tabs">
            <button type="button" class="btn js-tab"
                    :class="{ on: isSearchNowtab }"
                    @click="isSearchNowtab = true">
                <span>{{$t('home.recentSearches')}}</span>
            </button>
            <button type="button" class="btn js-tab"
                    :class="{ on: !isSearchNowtab }"
                    @click="isSearchNowtab = false">
                <span>{{$t('home').bookmark}}</span>
            </button>
        </div>

        <ul v-if="isSearchNowtab">
            <li v-for="(item, key) in retrieved" :key="key">
                <button type="button" class="btn js-star"
                        :class="{ on: item.mark }"
                        @click="toggleMark(item)">
                    <i class="icon icon-star-full"></i>
                </button>
                <router-link class="link"
                             :to="{name: 'player', params: {id: item.id, lang: $route.params.lang}}">
                    {{ item.id }}
                </router-link>
                <button class="remove-btn" @click="removeRetrievedID(item.id)">x</button>
            </li>
        </ul><!--// retrieved -->
        <ul v-else>
            <li v-for="(id, key) in bookmarks"
                :key="key">
                <button type="button" class="btn js-star on"
                        @click="removeBookmark(id)">
                    <i class="icon icon-star-full"></i>
                </button>
                <router-link class="link"
                             :to="`${$route.fullPath}/player/${id}`">{{ id }}</router-link>
                <button class="remove-btn" @click="removeBookmark(id)">x</button>
            </li>
        </ul><!--// bookmark -->
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';

@Component({
    computed: {
        ...mapGetters([
            'retrievedIDs',
            'bookmarks',
        ]),
    },
})
export default class SearchHelper extends Vue {
    isSearchNowtab: boolean = true;
    isNotSearchModal: boolean = false;
    player?: string = '';
    retrieved: any[] = [];
    bookmarked: any[] = [];

    async created() {
        const {retrievedIDs, bookmarks} = this.$store.getters;
        this.retrieved = retrievedIDs.map((id: string) => {
            return {
                mark: bookmarks.findIndex((bookmark: string) => bookmark === id) >= 0,
                id,
            };
        });
    }

    bookmark(player: string) {
        this.$store.dispatch('addBookmark', player);
    }

    removeBookmark(player: string) {
        this.$store.dispatch('removeBookmark', player);
    }

    removeRetrievedID(player: string) {
        const index = this.retrieved.findIndex((item: any) => {
            return item.id === player;
        });

        this.$store.dispatch('removeRetrievedID', player);
        this.retrieved.splice(index, 1);
    }

    toggleMark(player: any) {
        const marked = !player.mark;
        player.mark = marked;

        if (marked) {
            this.bookmark(player.id);
        } else {
            this.removeBookmark(player.id);
        }
    }

    @Watch('$store.getters.bookmarks')
    updateBookmarks() {
        const {retrievedIDs, bookmarks} = this.$store.getters;
        this.retrieved = retrievedIDs.map((id: string) => {
            return {
                mark: bookmarks.findIndex((bookmark: string) => bookmark === id) >= 0,
                id,
            };
        });
    }
}
</script>

<style scoped>

</style>