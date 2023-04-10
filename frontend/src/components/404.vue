<template>
  <div>404 Never gonna give you up</div>
</template>

<script type='ts'>
import { defineComponent, onServerPrefetch } from 'vue'
import { useSSRContext } from '@shared/ssrContext.js'

export default defineComponent({
  setup()
  {
    onServerPrefetch(() =>
    {
      const ctx = useSSRContext()
      ctx.statusCode = 404
    })
    return {}
  }
})
</script>