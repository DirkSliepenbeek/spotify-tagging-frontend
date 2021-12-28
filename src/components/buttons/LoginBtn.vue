<template>
  <v-btn v-if="!loggedIn" class="white--text" style="border-radius:20px" color='#1DB954' @click="submitApp">
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
  computed: mapState({
    loggedIn: state => state.loggedIn,
    tags: state => state.tags
  }),
}
</script>