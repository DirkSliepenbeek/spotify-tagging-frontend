import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from "@/store/auth/index";
import * as tracks from "@/store/tracks/index";


Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth,
        tracks,
    }
});

export default store;
