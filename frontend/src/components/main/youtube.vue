<template>
  <a
    v-if="kind === 'link'"
    :href="'https://www.youtube.com/watch?v=' + id"
  ></a>
  <v-responsive
    v-else
    :aspect-ratio="16/9"
    max-height="70vh"
  >
    <iframe
      style="width: 100%; height: 100%"
      :src="'https://www.youtube-nocookie.com/embed/' + id"
    ></iframe>
  </v-responsive>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue"

export type Kind = 'embed' | 'link'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    },
    kind: {
      type: String as PropType<Kind>,
      required: false,
      default: () =>
      {
        return 'link'
      }
    }
  },
  setup()
  {

  }
})
</script>