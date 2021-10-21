import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import { routerCompilation, localizedRoutes } from './routes'

function createBundledRouter() {
  return {
    router: 
      createRouter({
        history: __IS_SERVER__ ? createMemoryHistory() : createWebHistory(),
        routes: routerCompilation()
      }),
    localizedRoutes
  }
}

export { createBundledRouter };