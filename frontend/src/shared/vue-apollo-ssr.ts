import { onBeforeMount, onMounted, onServerPrefetch, watch } from 'vue'
import type { UseQueryReturn } from '@vue/apollo-composable'

export function useQuerySSR<T, K>(f: () => void, res: UseQueryReturn<T, K>)
{
  onBeforeMount(() =>
  {
    if (!res.loading.value)
      f()
  })
  onServerPrefetch(async () =>
  {
    await new Promise<void>((resolve) =>
    {
      watch(res.loading, value =>
      {
        if (res.error.value)
          console.log("Error loading query: " + res.error)
        else if (res.result.value)
          f()
        resolve()
      })
    })
  })
  onMounted(() =>
  {
    if (res.loading.value)
      watch(res.result, value =>
      {
        if (!res.error.value)
          f()
      })
  })
}