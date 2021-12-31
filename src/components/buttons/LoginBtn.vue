<template>
  <v-btn class="white--text" style="border-radius:20px" color='#1DB954' @click="submitApp">
    Login
  </v-btn>
</template>
<script>
import {mapState} from "vuex";
import $store from "@/store";

export default {
  name: 'LoginBtn',
  props: {},
  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
    }),
    ...mapState('tracks', {
      tags: state => state.tags
    }),
  },
  methods: {
    async submitApp() {
      await $store.dispatch('auth/submitApp')
    }
  }
}
</script>