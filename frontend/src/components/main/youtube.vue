<template>
  <a
    v-if="kind === 'link'"
    :href="'https://www.youtube.com/watch?v=' + id"
    style="color: var(--color-primary);"
    target="_blank"
    rel="noopener noreferrer"
  ><strong>{{ description + '  ' }}</strong><v-icon :icon="mdiOpenInNew"></v-icon></a>
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
import { mdiOpenInNew } from "@mdi/js"

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
    },
    description: {
      type: String,
      required: false,
      default: () =>
      {
        return null
      }
    }
  },
  setup()
  {
    return { mdiOpenInNew }
  }
})
</script>