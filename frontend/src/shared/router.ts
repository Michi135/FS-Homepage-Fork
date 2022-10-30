import { createRouter, createMemoryHistory, createWebHistory } from "vue-router"
import { routes } from '@client/routes'
import localizedRoutes from './localizedRoutes'

function createLocalizedRoutes()
{
  const out: Record<string, Record<string, string>> = {}

  for (let [lang, values] of Object.entries(localizedRoutes))
  {
    out[lang] = {}
    for (let [key, { title }] of Object.entries(values))
      out[lang][key] = title
  }
  //console.log(out)

  return out
}

function createBundledRouter()
{
  return {
    router:
      createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: routes.routerCompilation()
      }),
    localization: createLocalizedRoutes()
  }
}

export { createBundledRouter }