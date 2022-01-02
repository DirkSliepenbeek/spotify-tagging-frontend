<template>
  <v-data-table
      v-if="loggedIn && tracks"
      :items="tracks ? tracks : []"
      :headers="headers"
      :items-per-page="10"
      class="elevation-1 mt-6"
  >
    <template v-slot:header="{}">
      <thead>
      <tr>
        <td colspan="4">
          <v-text-field
              filled
              v-model="search"
              label="Search"
              class="pt-8 mx-4"
          ></v-text-field>
        </td>
      </tr>

      </thead>
    </template>

    <template v-slot:body="{ items }">

      <tbody>

      <tr
          v-for="(item, index) in items"
          :key="item.id"
          @mouseover="selectItem(item)"
          @mouseleave="unSelectItem()"
      >
        <td>
          <div v-if="item === selectedItem">
            <v-icon
                v-if="currentTrack===item.track && pause"
                @click="togglePlay"
            >mdi-play
            </v-icon>
            <v-icon
                v-else-if="!currentTrack || currentTrack !== item.track || pause"
                @click="playTrack(item); createTrack(item)"
            >mdi-play
            </v-icon>

            <v-icon
                v-else
                @click="togglePlay"
            >mdi-pause
            </v-icon>

          </div>
          <v-icon v-else-if="item.track === currentTrack && !pause" color="#1db954">
            mdi-chart-bar
          </v-icon>
          <span v-else-if="item.track === currentTrack" style="color: #1db954">
            {{ index + 1 }}
          </span>
          <span v-else>
            {{ index + 1 }}
          </span>

        </td>
        <td class="text-left">
          <span v-if="item.track === currentTrack" style="color:#1db954">
            {{ item.track.name }}
          </span>
          <span v-else>
             {{ item.track.name }}
          </span>

          <br>
          <small>
            {{ getArtists(item.track) }}
          </small>
        </td>
        <td class="text-left"><small>{{ item.track.album.name }}</small></td>
        <td>
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
              background-color="rgba(0,0,0,0)"
          >
            <template v-slot:select="{ attrs, item}">
              <v-chip small class="ma-1">
                {{ item }}
              </v-chip>
            </template>
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
        </td>
      </tr>
      </tbody>
    </template>

  </v-data-table>
</template>
<script>
import {mapState} from "vuex";
import $store from "@/store";

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
    }),
    ...mapState("player", {
      currentTrack: state => state.currentTrack,
      pause: state => state.pause
    })
  },
  data() {
    return {
      search: '',
      selectedItem: false,
      headers: [
        {text: '#', value: 'actions', width: "10%", sortable: false, align: 'center'},
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
          text: '',
          value: 'tags',
          filterable: true,
          filter: this.tagFilter,
          width: "35%",
          cellClass: 'ma-2 pa-2',
          align: 'start',
          sortable: true
        }]
    }
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item
    },
    unSelectItem() {
      this.selectedItem = false
    },
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
      return item.track.name.toLowerCase().includes(this.search.toLowerCase()) || item.track.album.name.toLowerCase().includes(this.search.toLowerCase());
    },
    togglePlay() {
      $store.dispatch('player/togglePlay')
    },
    playTrack(track) {
      $store.dispatch('player/playSong', track)
    },
    getArtists(track) {
      let string = ''
      track.artists.forEach(artist => {
        if (artist.name) {
          string += artist.name + ", "
          return string
        }

      })
      string = string.slice(0, -2)
      return string
    },
    createTrack(item) {
      $store.dispatch('backend_auth/createTrack', item)
    }

  },

  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.body.appendChild(recaptchaScript)
  }
}
</script>