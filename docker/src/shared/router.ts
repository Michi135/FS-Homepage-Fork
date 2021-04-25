import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import { routerCompilation } from './routes'

function createBundledRouter() {
  return createRouter({
    history: __IS_SERVER__ ? createMemoryHistory() : createWebHistory(),
    routes: routerCompilation()
  });
}
export { createBundledRouter };