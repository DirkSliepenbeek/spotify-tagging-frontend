import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from "@/store/spotify_auth/index";
import * as tracks from "@/store/tracks/index";
import * as player from "@/store/player/index";
import * as backend_auth from "@/store/backend_auth/index";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
    modules: {
        auth,
        tracks,
        player,
        backend_auth
    },
    plugins: [vuexLocal.plugin]
});

export default store;
