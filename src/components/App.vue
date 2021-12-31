<template>
  <v-app>
    <v-app-bar
        app
        color="#1DB954"
        dark
    >
      <span>Spotify app</span>
    </v-app-bar>
    <v-main style="background-color: #FAFAFA;">
      <v-row class="mt-4 text-center" style="display: flex; justify-content: center">
        <v-col cols=8>
          <LoginBtn v-if="!loggedIn"/>
          <FetchPlayListBtn v-else-if="!playlists"/>
          <v-icon v-else
                  color="green"
                  large
                  :disabled="tags && tags[tags.length-1].trim()==='' ? true: false"
                  @click="editingIndex=tags.length; tags.push(''); editing=true;">
            mdi-plus-circle-outline
          </v-icon>
          <br>
          <!--          TODO extract when api call to create tag is available -->

          <TagChipsCard :editing-index="editingIndex"/>


          <TrackDataTable v-if="tracks"/>
        </v-col>
      </v-row>


    </v-main>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import TrackDataTable from "@/components/TrackDataTable";
import FetchPlayListBtn from "@/components/buttons/FetchPlayListBtn";
import LoginBtn from "@/components/buttons/LoginBtn";
import TagChipsCard from "@/components/cards/TagChipsCard";
import $store from "@/store";


export default {
  name: 'App',
  components: {TagChipsCard, LoginBtn, FetchPlayListBtn, TrackDataTable},
  data: () => ({
    editing: false,
    editingIndex: null,
    newTag: ""
  }),
  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
    }),
    ...mapState('tracks', {
      tags: state => state.tags,
      tracks: state => state.tracks,
      playlists: state => state.playlists,

    })
  },
  methods: {},
  async mounted() {
    let refresh_token = localStorage.getItem("refresh_token")
    let access_token = localStorage.getItem("access_token")
    if (access_token && refresh_token) {
      try {
        await $store.dispatch('auth/fetchUser', {'accessToken': access_token})
        $store.commit('auth/SET_ACCESS_TOKEN', access_token)
        $store.commit('auth/SET_REFRESH_TOKEN', refresh_token)
      } catch {
        await $store.dispatch('auth/refreshToken', {'refreshToken': refresh_token})
      }
    } else if (window.location.search.length > 0) {
      await $store.dispatch('auth/handleRedirect')
    } else {
      await $store.dispatch('auth/submitApp')
    }
    await $store.dispatch('player/fetchWebPlaybackSDKPlayer')
    await $store.dispatch('backend_auth/fetchAuthToken')
    await window.history.pushState("", "", this.redirectUri)

  }
}
;
</script>
