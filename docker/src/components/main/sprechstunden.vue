<template>
  <div id="sprechstunden">
    <br />
    <ferien-comp v-if="ferien"></ferien-comp>
    <normal-comp v-else></normal-comp>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ferienComp from './feriensprechstunden.vue'
import normalComp from './normalSprechstunden.vue'

export default defineComponent({
  components: {
    ferienComp,
    normalComp
  },
  setup: () =>
  {
    const ferien = true

    return {
      ferien
    }
  }
})
</script>

<style lang="less">
#sprechstunden
{
  h1 {
    color: var(--color-primary-header);
    font-size: 1.5rem;
  }
  h2 {
    color: white;
    font-size: 1.2rem;
  }
}
</style>