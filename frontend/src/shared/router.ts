import { createRouter, createMemoryHistory, createWebHistory } from "vue-router"
import { routerCompilation } from './routes'
import localizedRoutes from './localizedRoutes.json'

function createBundledRouter()
{
  return {
    router:
      createRouter({
        history: __IS_SERVER__ ? createMemoryHistory() : createWebHistory(),
        routes: routerCompilation()
      }),
    localizedRoutes
  }
}

export { createBundledRouter }