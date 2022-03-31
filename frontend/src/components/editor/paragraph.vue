<template>
  <p>
    <template v-if="components.get(uuid)!.children">
      <component
        v-for="[k, v] in components.get(uuid)!.children"
        :key="k"
        :is="v.component"
        v-bind="{...v.props}"
      >
      </component>
    </template>
  </p>
</template>

<script lang="ts">
import { storeToRefs } from "pinia"
import { defineComponent } from "vue"
//import { textNode } from "./renderer"
import { useStore } from './store'

import textnode from './textnode.vue'

export default defineComponent({
  components: {
    "textnode": textnode
  },
  props:{
    uuid: {
      type: String,
      required: true
    }
  },
  setup()
  {
    const { components } = storeToRefs(useStore())

    return {
      components
    }
  }
})
</script>