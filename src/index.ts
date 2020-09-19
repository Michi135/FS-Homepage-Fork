/**
 * This is your app main file
 *
 * Use it to do anything you want in your Factor app
 */
import { addFilter, setting, addDashboardMenu, addRoutes } from "@factor/api"

addRoutes({
  key: "myRoutes",
  routes: [
    {
      path: "/fs-vertreter",
      component: (): Promise<any> => import("./vertreter.vue"),
      meta: { nav: true },
    },
    {
      path: "/sprechstunden",
      component: (): Promise<any> => import("./sprechstunden.vue"),
      meta: { nav: true },
    },
  ],
})

addDashboardMenu({
  name: "Upload",
  path: "/upload",
  key: "upload",
  /*component: (): Promise<any> => import("./dashboard/wrap.vue"),
  children: [
    {
      name: "Subscription",
      path: "/",
      component: (): Promise<any> => import("./dashboard/subscription.vue"),
    },
    {
      name: "Payment Method",
      path: "payment-method",
      component: (): Promise<any> => import("./dashboard/payment-methods.vue"),
    },
    {
      name: "Invoices",
      path: "invoices",
      component: (): Promise<any> => import("./dashboard/invoices.vue"),
    },
  ],*/
})