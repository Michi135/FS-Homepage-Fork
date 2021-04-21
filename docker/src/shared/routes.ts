import type { RouteRecordRaw } from 'vue-router';

const defaultLayout = () => import('@components/main/content.vue')

let headerRoutes: RouteRecordRaw[] = [

    {
        path: "/",
        component: () => import('@components/main/home.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Home"
        }
    },
    {
        path: "/vertreter",
        component: () => import('@components/main/vertreter.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            favicon: require('@static/favicon2.svg'),
            title: "Vertreter",
        }
    },
    {
        path: "/keinePanik",
        component: () => import('@components/main/panik.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Keine Panik",
        }
    },
    {
        path: "/externe",
        component: () => import('@components/main/externals.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Externe Links",
        }
    }
]

let footerRoutes: RouteRecordRaw[] = [

    {
        path: "/impressum",
        component: () => import('@components/main/impressum.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Impressum",
        }
    },
    {
        path: "/sprechstunden",
        component: () => import('@components/main/sprechstunden.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Sprechstunden",
        }
    },
    {
        path: "/kontakt",
        component: () => import('@components/main/kontakt.vue'/* webpackChunkName: "home" */),
        meta:
        {
            layout: defaultLayout,
            title: "Kontakt",
        }
    }
]

let routes: RouteRecordRaw[] = [
    {
        path: "/:catchAll(.*)",
        component: () => import('@components/404.vue'),
        meta:
        {
            layout: defaultLayout,
            title: "404 Error",
        }
    }
]
export { headerRoutes, footerRoutes }

export function allRoutes() {
    return routes.concat(headerRoutes).concat(footerRoutes)
}