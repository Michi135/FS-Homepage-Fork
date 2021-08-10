import type { RouteRecordRaw } from 'vue-router';

const defaultLayout = () => import('@components/main/content.vue'/* webpackChunkName: "home" */)

export const basePaths = {
    home: '/',
    dashboard: '/',
    account: '/'
} as const

let headerRoutes: RouteRecordRaw[] = [
    {
        path: "",
        component: () => import('@components/main/home.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Home"
        }
    },
    /*{
        path: "wahl",
        component: () => import('@components/main/hochschulwahl.vue'/* webpackChunkName: "home" *//*),
meta:
{
    favicon: require('@components/main/wal.svg'),
    title: "Hochschulwa(h)l",
}
},*/
    {
        path: "vertreter",
        component: () => import('@components/main/vertreter.vue'/* webpackChunkName: "home" */),
        meta:
        {
            favicon: require('@static/favicon2.svg'),
            title: "Vertreter",
        }
    },
    {
        path: "erstis",
        component: () => import('@components/main/erstis.vue'/* webpackChunkName: "home" */),
        meta:
        {
            favicon: require('@components/main/student.svg'),
            title: "Erstis",
        }
    },
    {
        path: "keinePanik",
        component: () => import('@components/main/panik.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Keine Panik",
        }
    },
    {
        path: "externe",
        component: () => import('@components/main/externals.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Externe Links",
        }
    }
]

let footerRoutes: RouteRecordRaw[] = [

    {
        path: "impressum",
        component: () => import('@components/main/impressum.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Impressum",
        }
    },
    {
        path: "sprechstunden",
        component: () => import('@components/main/sprechstunden.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Sprechstunden",
        }
    },
    {
        path: "kontakt",
        component: () => import('@components/main/kontakt.vue'/* webpackChunkName: "home" */),
        meta:
        {
            title: "Kontakt",
        }
    }
]

let routes: RouteRecordRaw[] = [
    {
        path: "",
        component: () => import('@components/404.vue'),
        meta:
        {
            title: "404 Error",
        }
    }
]
export { headerRoutes, footerRoutes }

export function allRoutes() {
    return routes.concat(headerRoutes).concat(footerRoutes)
}

export function routerCompilation(): RouteRecordRaw[] {
    return [
        {
            path: basePaths.home,
            component: defaultLayout,
            children: headerRoutes.concat(footerRoutes)
        },
        {
            path: '/:catchAll(.*)',
            component: defaultLayout,
            children: routes
        }
    ]
}