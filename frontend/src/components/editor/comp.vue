<template>
  <div>
    <p
      contenteditable="true"
    >
      {{ text }}
    </p>
    <p v-if="say">
      {{ say }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  props: {
    uuid: {
      type: String,
      required: true
    },
    say: {
      type: String,
      required: false,
      default: undefined
    }
  },
  setup()
  {
    const text = ref('Hello, World!')

    return { text }
  }
})

</script>