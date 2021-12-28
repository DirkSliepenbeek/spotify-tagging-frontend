<template>
  <v-chip-group filter class="pa-2 pl-4 pr-4" multiple column cols="12"
                active-class="deep-purple--text text--accent-4">
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
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'TagChips',
  props: {
    editingIndex: {},
  },
  computed: mapState({
    tags: state => state.tags
  }),
}
</script>