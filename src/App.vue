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
          <v-btn v-if="!loggedIn" class="white--text" style="border-radius:20px" color='#1DB954' @click="submitApp()">
            Login
          </v-btn>
          <v-btn v-if="loggedIn && !(tags.length)" class="white--text" style="border-radius:20px" color='#1DB954'
                 @click="fetchPlaylists()">
            Get playlists!
          </v-btn><br>

          <v-card class="mt-4" style="display: flex;background-color: white; justify-content: center" elevation="1">

              <v-chip-group filter class="pa-2 pl-4 pr-4" multiple column cols="12" active-class="deep-purple--text text--accent-4">
                <v-chip
                    v-for="(tag, index) in tags" :key="tag.id">
                  <div v-if="(index)===editingIndex">
                    <input id="html" class="text-center" v-model="tags[index]" type="text" style="outline: none">
                    <label for="html"></label>
                  </div>
                  <span v-else>
                {{
                      tag
                    }}</span>


                </v-chip>
              </v-chip-group>
          </v-card>
           <v-icon v-if=tags.length class="mt-4" color="green" large
                   :disabled="tags[tags.length-1].trim()==='' ? true: false"
                   @click="editingIndex=tags.length; tags.push(''); editing=true;">
                mdi-plus-circle-outline
              </v-icon>
          <v-data-table
              :headers="[{text:'Popularity', value:'track.popularity', },{text:'Title', value:'track.name'},{text:'Album', value:'track.album.name'}, {text:'Tags',value:'tags'},]"
              :items="tracks ? tracks : []"
              :items-per-page="10"
              class="elevation-1 mt-6"
          >
            <template v-slot:item.track.popularity="{ item }">
              <v-chip
                  :color="getColor(item.track.popularity)"
                  dark
              >
                {{ item.track.popularity }}
              </v-chip>
            </template>
            <template v-slot:item.tags="{ item }">
              <v-combobox
                  small-chips
                  multiple
                  v-model="item.tags"
                  :items="tags"
              >
                <template v-slot:item="{ index, item }">
                  <v-chip
                      :color="`${item.color} lighten-3`"
                      small
                  >
                    {{ item }}
                  </v-chip>
                  <!--                  <v-spacer></v-spacer>-->
                  <!--                  <v-list-item-action @click.stop>-->
                  <!--                    <v-btn-->
                  <!--                        icon-->
                  <!--                        @click.stop.prevent="edit(index, item)"-->
                  <!--                    >-->
                  <!--                      <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>-->
                  <!--                    </v-btn>-->
                  <!--                  </v-list-item-action>-->
                </template>


              </v-combobox>

            </template>


          </v-data-table>
        </v-col>
      </v-row>


    </v-main>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import $store from '../src/store'

export default {
  name: 'App',
  components: {},

  data: () => ({
    clientId: "2aa99d4e3f9d491f86043aaa41f43000",
    clientSecret: "414244e090d9468d99aea9c7ea9ac4a6",
    spotifyAuthUrl: "https://accounts.spotify.com/authorize",
    spotifyTokenUrl: "https://accounts.spotify.com/api/token",
    redirectUri: "http://localhost:8080/",
    tags: [],
    editing: false,
    editingIndex: null,
    newTag: ""
  }),
  computed: mapState({
    loggedIn: state => state.loggedIn,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    userId: state => state.userId,
    playlists: state => state.playlists,
    tracks: state => state.tracks
  }),
  methods: {
    async fetchPlaylists() {
      try {
        if (!this.tracks) {
          await $store.dispatch('fetchPlaylists', {'accessToken': this.accessToken, 'userId': this.userId})

        } else {
          this.playlists.forEach(playlist => this.tags.push(playlist.name))
        }

      } catch (error) {
        console.log(error)
      }
    }
    ,
    submitApp() {
      let url = this.spotifyAuthUrl;
      url += "?client_id=" + this.clientId;
      url += "&response_type=code";
      url += "&redirect_uri=" + encodeURI(this.redirectUri)
      url += "&show_dialog=False";
      window.location.href = url
    }
    ,
    handleRedirect() {
      let code = this.getCode();
      this.fetchAccessToken(code);
    }
    ,
    getCode() {
      let code = null;
      const querystring = window.location.search;
      if (querystring.length > 0) {
        const urlParams = new URLSearchParams(querystring);
        code = urlParams.get('code')
      }
      return code;
    }
    ,
    async fetchAccessToken(code) {
      let body = 'grant_type=authorization_code';
      body += "&code=" + code;
      body += "&redirect_uri=" + encodeURI(this.redirectUri);
      body += "&client_id=" + this.clientId;
      body += "&client_secret=" + this.clientSecret;
      await this.callAuthorizationApi(body)
    }
    ,
    async callAuthorizationApi(body) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.spotifyTokenUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.clientId + ":" + this.clientSecret));
      xhr.send(body);
      xhr.onload = function () {
        if (this.status === 200) {
          var data = JSON.parse(this.responseText);
          if (data.access_token !== undefined) {
            $store.commit('SET_ACCESS_TOKEN', data.access_token)
          }
          if (data.refresh_token !== undefined) {
            $store.commit('SET_REFRESH_TOKEN', data.refresh_token)
          }
          $store.commit('SET_LOG_IN', true)
        } else {
          console.log(this.responseText)
        }
      }

    }
    ,
    getColor(popularity) {
      if (popularity === 0) return 'grey'
      else if (popularity > 75) return 'green'
      else if (popularity > 50) return 'orange'
      else if (popularity > 25) return 'green'
      else return 'grey'
    },

  },
  mounted() {
    if (window.location.search.length > 0) {
      this.handleRedirect()
    } else {
      this.submitApp()
    }
  }
}
;
</script>
