<template>
  <div id="sprechstunden">
    <br />
    <template v-if="ferien !== undefined">
      <ferien-comp v-if="ferien === true"></ferien-comp>
      <normal-comp v-else></normal-comp>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ferienComp from './feriensprechstunden.vue'
import normalComp from './normalSprechstunden.vue'
import ei from '@shared/Queries/einstellungen'

export default defineComponent({
  components: {
    ferienComp,
    normalComp
  },
  setup: () =>
  {
    const res = ei()

    const ferien = computed(() =>
    {
      return res.result.value?.einstellungen.data.attributes.Ferien
    })

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