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
  props: {},
  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
      accessToken: state => state.accessToken,
      refreshToken: state => state.refreshToken,
      userId: state => state.userId,
    }),
    ...mapState('tracks', {
      tags: state => state.tags,
      playlists: state => state.playlists,
      tracks: state => state.tracks,
    }),
  }

  ,
  methods: {
    async fetchPlaylists() {
      console.log('fetchPlaylists')
      try {
        if (!this.tracks) {
          await $store.dispatch('tracks/fetchPlaylists', {'accessToken': this.accessToken, 'userId': this.userId})
          await $store.dispatch('player/fetchWebPlaybackSDKPlayer')
        }
      } catch (error) {
        console.log(error)
      }
    }
    ,
  }
}
</script>