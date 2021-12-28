<template>
  <v-btn class="white--text" style="border-radius:20px" color='#1DB954'
         @click="fetchPlaylists">
    Get playlists!
  </v-btn>
</template>
<script>
import {mapState} from "vuex";
import $store from "@/store";

export default {
  name: 'FetchPlayListBtn',
  props: {
  },
  computed: mapState({
    loggedIn: state => state.loggedIn,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    userId: state => state.userId,
    playlists: state => state.playlists,
    tracks: state => state.tracks,
    tags: state => state.tags
  }),
  methods: {
    async fetchPlaylists() {
      console.log('fetchPlaylists')
      try {
        if (!this.tracks) {
          await $store.dispatch('fetchPlaylists', {'accessToken': this.accessToken, 'userId': this.userId})
        }
      } catch (error) {
        console.log(error)
      }
    }
    ,
  }
}
</script>