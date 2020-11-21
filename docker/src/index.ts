/**
 * This is your app main file
 *
 * Use it to do anything you want in your Factor app
 */
import { addFilter, addDashboardMenu, addRoutes, addContentRoute, editContentRoute } from "@factor/api"

addRoutes({
  key: "myRoutes",
  routes: [
    {
      path: "/fs-vertreter",
      component: (): Promise<any> => import("./vertreter/vertreter.vue"),
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
    {
      path: "/external-links",
      component: (): Promise<any> => import("./externals.vue"),
    },
    {
      path: "/impressum",
      component: (): Promise<any> => import("./impressum.vue"),
    },
    {
      path: "/aktuelles",
      component: (): Promise<any> => import("./wip.vue"),
    },
    /*{
      path: "/erstis",
      component: (): Promise<any> => import("./erstis.vue"),
    },*/
  ],
})

editContentRoute({
  path: "/about",
  action: "remove"
})
editContentRoute({
  path: "/contact",
  action: "remove"
})
editContentRoute({
  path: "/pricing",
  action: "remove"
})


addContentRoute({
  name: "signin",
  path: "/signin",
  component: (): Promise<any> => import("./signin-view.vue"),
})


addDashboardMenu({
  name: "Upload",
  path: "/upload",
  key: "upload",
})

const setup = (): void => {

  addFilter({
    hook: "webpack-loaders",
    key: "pdf-loader",
    callback: loaders => {

      loaders.push({
        test: /\.pdf$/,
        loader: 'file-loader',
        // esModule option introduced in v5, but breaks markdown-image-loader
        options: { name: "[name]-[hash:8].[ext]", esModule: false },
      })

      return loaders
    }
  })
}

setup()