import { createDefaultApp } from '@shared/app'
import type { State } from '@shared/store'
//import type { GraphQLClients } from '@shared/graphql'

declare global {
    interface Window {
        __INITIAL_STATE__?: State
    }
}

let instance: ReturnType<typeof createDefaultApp>

if (window.__INITIAL_STATE__)
{

  //TODO:: check if lang is valid (in en, de)
  //const lang = <'de' | 'en'>localStorage.getItem('lang');
  instance = createDefaultApp({ language: window.__INITIAL_STATE__.language })
  instance.store.replaceState(window.__INITIAL_STATE__)

  const scripts = window.document.getElementsByTagName("script")
  for (let i = 0; i < scripts.length; ++i)
  {
    const script = scripts[i]
    if (script.text.startsWith("window.__INITIAL_STATE__"))
    {
      script.remove()
      break
    }
  }
}
else
{
  instance = createDefaultApp({})
}

instance.router.isReady().then(() =>
{
  instance.app.mount('#app', true)
})
