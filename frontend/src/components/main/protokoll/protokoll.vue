<template>
  <div v-html="sane"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import html from '@static/protokollTest/main.html?raw'
import sanitize from 'sanitize-html'

export default defineComponent({
  setup()
  {
    const sane = sanitize(html)

    return {
      sane
    }
  }
})
</script>