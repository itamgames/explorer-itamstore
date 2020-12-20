import Vue from 'vue';
import Vuex, {Module} from 'vuex';
import {RootState} from '../interface';
import {State} from './search.interface';
import {STORAGE} from '../../common/config/app.config';

Vue.use(Vuex);

const store: Module<State, RootState> = {
    state: {
        bookmarks: [],
        retrievedIDs: [],
    },
    actions: {
        initSearchHistory({dispatch}) {
            dispatch('initBookmarks');
            dispatch('initRetrievedIDs');
        },
        initBookmarks({commit}) {
            const storageItem: string | null = localStorage.getItem(STORAGE.BOOKMARK);

            if (storageItem) {
                const bookmarks: string[] = storageItem.split(',');
                commit('setBookmarks', bookmarks);
            }
        },
        initRetrievedIDs({commit}) {
            const storageItem: string | any = localStorage.getItem(STORAGE.RETRIEVED_ID);

            if (storageItem) {
                const retrievedIDs: string[] = storageItem.split(',');
                commit('setRetrievedIDs', retrievedIDs);
            }
        },
        addBookmark({commit, state}, id: string) {
            if (_hasId(state.bookmarks, id)) { return; }

            const bookmarks: string[] = state.bookmarks;
            bookmarks.push(id);

            localStorage.setItem(STORAGE.BOOKMARK, bookmarks.toString());
            commit('setBookmarks', bookmarks);
        },
        addRetrievedID({commit, state}, id: string) {
            if (_hasId(state.retrievedIDs, id)) { return; }

            const retrievedIDs: string[] = state.retrievedIDs;
            retrievedIDs.push(id);

            localStorage.setItem(STORAGE.RETRIEVED_ID, retrievedIDs.toString());
            commit('setRetrievedIDs', retrievedIDs);
        },
        removeBookmark({commit, state}, id: string) {
            const bookmarks: string[] = state.bookmarks;
            const index: number = bookmarks.findIndex((item: string) => item === id);
            bookmarks.splice(index, 1);

            localStorage.setItem(STORAGE.BOOKMARK, bookmarks.toString());
            commit('setBookmarks', bookmarks);
        },
        removeRetrievedID({commit, state}, id: string) {
            const retrievedIDs: string[] = state.retrievedIDs;
            const index: number = retrievedIDs.findIndex((item: string) => item === id);
            retrievedIDs.splice(index, 1);

            localStorage.setItem(STORAGE.RETRIEVED_ID, retrievedIDs.toString());
        },
    },
    getters: {
        bookmarks: (state: any) => state.bookmarks,
        retrievedIDs: (state: any) => state.retrievedIDs,
    },
    mutations: {
        setBookmarks(state: any, id: string) {
            state.bookmarks = id;
        },
        setRetrievedIDs(state: any, id: string) {
            state.retrievedIDs = id;
        },
    },
};

function _hasId(target, id) {
    return target.findIndex((item: string) => id === item) >= 0;
}

export default store;

