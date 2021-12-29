<template>
  <v-btn class="white--text" style="border-radius:20px" color='#1DB954' @click="submitApp">
    Login
  </v-btn>
</template>
<script>
import {mapState} from "vuex";
import SpotifyApiMixin from "@/mixins/SpotifyApiMixin";

export default {
  name: 'LoginBtn',
  mixins: [SpotifyApiMixin],
  props: {
  },
  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
    }),
    ...mapState('tracks', {
      tags: state => state.tags
    }),
  }

}
</script>