<template>
  <v-data-table
      v-if="loggedIn && tracks"
      :headers="headers"
      :items="tracks ? tracks : []"
      :items-per-page="10"
      class="elevation-1 mt-6"
      dense
  >

    <template v-slot:item.actions="{ item }">
      <v-icon
          @click="startPlaying(item)"
      >mdi-play
      </v-icon>

    </template>
    <template v-slot:top>
      <v-text-field
          filled
          v-model="search"
          label="Search"
          class="pt-8 mx-4"
      ></v-text-field>
    </template>

    <template v-slot:item.tags="{ item }">
      <v-combobox
          v-if="tags"
          flat
          solo
          multiple
          dense
          v-model="item.tags"
          :items="tags"
          item-color="deep-purple"
          hide-details
      >
        <template v-slot:selection="{ attrs, item}">
          <v-chip small class="ma-1">
            {{ item }}
          </v-chip>
        </template>

        <template v-slot:item="{ index, item }">
          <v-chip
              small
          >
            {{ item }}
          </v-chip>

        </template>


      </v-combobox>

    </template>


  </v-data-table>
</template>
<script>
import {mapState} from "vuex";


export default {
  name: 'TrackDataTable',
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
      selectedTags: state => state.selectedTags
    })
  },
  data() {
    return {
      search: '',
      player: null,
      headers: [
        {text: '', value: 'actions', width: "5%", sortable: false,},
        {
          text: 'Title',
          value: 'track.name',
          filterable: true,
          filter: this.nameFilter,
          cellClass: 'pl-6',
          class: 'pl-6',
          width: "30%"
        },
        {text: 'Album', value: 'track.album.name', filterable: true, filter: this.nameFilter, width: "30%"},
        {
          text: 'Tags',
          value: 'tags',
          filterable: true,
          filter: this.tagFilter,
          width: "35%",
          cellClass: 'ma-2 pa-2',
          align: 'start'
        }]
    }
  },
  methods: {
    tagFilter(value) {
      if (!this.selectedTags || this.selectedTags === "" || this.selectedTags.length === 0) {
        return true;
      }
      if (value) {
        let sortedSelectedTags = this.selectedTags.sort()
        let sortedTags = value.sort()
        return sortedTags.some(function (item) {
          return sortedSelectedTags.includes(item);
        })
      } else {
        return false
      }
    },
    nameFilter(value, search, item) {
      return item.track.name.includes(this.search) || item.track.album.name.includes(this.search);
    },
    startPlaying(item) {
      this.player.addListener('ready', ({device_id}) => {
        console.log('Ready with Device ID', device_id);
        // eslint-disable-next-line no-undef
        var player = new Spotify.Player({
          name: 'A Spotify Web SDK Player',
          getOAuthToken: callback => {
            callback(this.accessToken);
          },
          volume: 0.1
        });
        const play = ({
                        spotify_uri,
                        playerInstance: {
                          _options: {
                            getOAuthToken,
                            id
                          }
                        }
                      }) => {
          getOAuthToken(access_token => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
              method: 'PUT',
              body: JSON.stringify({uris: [spotify_uri]}),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
              },
            });
          });
        };

        play({
          playerInstance: player,
          spotify_uri: item.track.uri,
        });
      });

    }

  },
  mounted() {
    let recaptchaScript = document.createElement('script')

    recaptchaScript.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.body.appendChild(recaptchaScript)


    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.accessToken;
      // eslint-disable-next-line no-undef
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => {
          cb(token);
        },
        scope: 'web-playback',
        volume: 0.5
      });
      console.log(player)

      // Ready
      player.addListener('ready', ({device_id}) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({device_id}) => {
        console.log('Device ID has gone offline', device_id);
      });
      player.addListener('initialization_error', ({message}) => {
        console.log('initialization_error')

        console.error(message);
      });

      player.addListener('authentication_error', ({message}) => {
        console.log('authentication_error')

        console.error(message);
      });

      player.addListener('account_error', ({message}) => {
        console.log('account_error')
        console.error(message);
      });
      player.connect();

      this.player = player

    }
  }
}
</script>