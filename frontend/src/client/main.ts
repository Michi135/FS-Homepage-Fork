import { createDefaultApp } from '@shared/app.js'

createDefaultApp().then(({ router, app }) =>
{
  router.isReady().then(() =>
  {
    app.mount('#app', true)
  })

  if (import.meta.env.DEV)
  {
    router.onError((error, to) =>
    {
      console.warn(error)
      window.location.href = to.fullPath
    })
  }
})