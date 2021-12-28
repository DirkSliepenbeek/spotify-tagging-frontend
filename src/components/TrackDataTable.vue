<template>
  <v-data-table
      v-if="loggedIn"
      :headers="headers"
      :items="tracks ? tracks : []"
      :items-per-page="10"
      class="elevation-1 mt-6"
      :search="search"
  >
    <template v-slot:top>
      <v-text-field
          filled
          v-model="search"
          label="Search"
          class="pt-8 mx-4"
      ></v-text-field>
    </template>
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
</template>
<script>
import {mapState} from "vuex";


export default {
  name: 'TrackDataTable',
  computed: mapState({
    loggedIn: state => state.loggedIn,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    userId: state => state.userId,
    playlists: state => state.playlists,
    tracks: state => state.tracks,
    tags: state => state.tags
  }),
  data() {
    return {
      search: '',
      headers: [{text: 'Popularity', value: 'track.popularity', filterable: false},
        {text: 'Title', value: 'track.name', filterable: false},
        {text: 'Album', value: 'track.album.name', filterable: false},
        {text: 'Tags', value: 'tags', filterable: true, filter: this.nameFilter,},]
    }
  },
  methods: {
    getColor(popularity) {
      if (popularity === 0) return 'grey'
      else if (popularity > 75) return 'green'
      else if (popularity > 50) return 'orange'
      else if (popularity > 25) return 'green'
      else return 'grey'
    },
    nameFilter(value) {
        // If this filter has no value we just skip the entire filter.
        if (!this.tags) {
          return true;
        }
        console.log(value)

        // Check if the current loop value (The dessert name)
        // partially contains the searched word.
        return value.toLowerCase().includes(this.search.toLowerCase());
      },

  }
}
</script>