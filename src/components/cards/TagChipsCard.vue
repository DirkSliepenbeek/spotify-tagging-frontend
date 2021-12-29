<template>
  <v-card v-if="loggedIn && tags" class="mt-4" style="display: flex;background-color: white; justify-content: center"
          elevation="1">
    <TagChips :editing-index="editingIndex" :tags="tags"/>
  </v-card>
</template>
<script>
import TagChips from "@/components/TagChips"
import {mapState} from "vuex";

export default {
  name: 'TagChipsCard',
  components: {TagChips},
  props: {
    editingIndex: {},
  },
  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
    }),
    ...mapState('tracks', {
      tags: state => state.tracks
    }),
  }
}
</script>