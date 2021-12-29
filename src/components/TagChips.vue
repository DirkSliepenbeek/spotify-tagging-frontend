<template>
  <v-chip-group filter class="pa-2 pl-4 pr-4" multiple column cols="12"
                active-class="deep-purple--text text--accent-4" v-model="selectedTags" @click="selectTag()">
    <v-chip
        v-for="(tag, index) in tags" :key="tag.id"
    >
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
</template>
<script>
import {mapState} from "vuex";
import $store from "@/store";

export default {
  name: 'TagChips',
  props: {
    editingIndex: {},
  },
  data() {
    return {
      selectedTags: []
    }
  },
  computed: {
    ...mapState('tracks', {
      tags: state => state.tags,
      playlists: state => state.playlists,
      tracks: state => state.tracks,
    }),
  },
  watch: {
    selectedTags: function () {
      $store.dispatch('tracks/selectTags', this.selectedTags)
    },
  }
}
</script>