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
import SpotifyApiMixin from "@/mixins/SpotifyApiMixin";


export default {
  name: 'App',
  mixins: [SpotifyApiMixin],
  components: {TagChipsCard, LoginBtn, FetchPlayListBtn, TrackDataTable},
  data: () => ({
    editing: false,
    editingIndex: null,
    newTag: ""
  }),
  computed: {
    ...mapState('tracks', {
      tags: state => state.tags,
      tracks: state => state.tracks,
      playlists: state => state.playlists,

    })
  },
  methods: {},
  async mounted() {
    if (window.location.search.length > 0) {
      await this.handleRedirect()
    } else {
      await this.submitApp()
    }
  }
}
;
</script>
