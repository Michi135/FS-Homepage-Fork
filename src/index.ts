/**
 * This is your app main file
 *
 * Use it to do anything you want in your Factor app
 */
import { addFilter, setting, addDashboardMenu, addRoutes } from "@factor/api"
import * as pdf from "pdfvuer"

export const loadPage = async (page: BigInt): Promise<void> => {
  // pdf.
}

addRoutes({
  key: "myRoutes",
  routes: [
    {
      path: "/fs-vertreter",
      component: (): Promise<any> => import("./vertreter.vue"),
    },
    {
      path: "/sprechstunden",
      component: (): Promise<any> => import("./sprechstunden.vue"),
    },
    {
      path: "/kontakt",
      component: (): Promise<any> => import("./kontakt.vue"),
    },
    {
      path: "/keine-panik",
      component: (): Promise<any> => import("./panik.vue"),
    },
  ],
})

addDashboardMenu({
  name: "Upload",
  path: "/upload",
  key: "upload",
})