import fav2 from '@static/favicon2.svg'
import studentSvg from '@components/main/student.svg'
import localizedRoutes from '@shared/localizedRoutes'

import type { RouteComponent, RouteRecordRaw } from 'vue-router'

type Language = 'de' | 'en'

const defaultLayout = () => import('@components/main/layout/content.vue'/* webpackChunkName: "home" */)
const homeComponent = () => import('@components/main/home.vue'/* webpackChunkName: "home" */)
const vertreterComponent = () => import('@components/main/vertreter/vertreter.vue'/* webpackChunkName: "home" */)
const erstisComponent = () => import('@components/main/erstis.vue'/* webpackChunkName: "home" */)
const keinePanikComponent = () => import('@components/main/panik.vue'/* webpackChunkName: "home" */)
//const blogComponent = () => import('@components/main/blog.vue' /* webpackChunkName: "home" */)
const uniKinoComponent = () => import('@components/main/uniKino.vue' /* webpackChunkName: "home" */)
const sprechstundenComponent = () => import('@components/main/sprechstunden/sprechstunden.vue'/* webpackChunkName: "home" */)

const impressumComponent = () => import('@components/main/impressum.vue'/* webpackChunkName: "footer" */)
const kontaktComponent = () => import('@components/main/kontakt.vue'/* webpackChunkName: "footer" */)
const externeComponent = () => import('@components/main/externals.vue'/* webpackChunkName: "footer" */)
//const testComponent = () => import('@components/editor/editor.vue' /* webpackChunkName: "footer" */)
const wahlComponent = () => import('@components/main/hochschulwahl.vue'/* webpackChunkName: "home" */)
const partyComponent = () => import('@components/main/nw2_party.vue' /* webpackChunkName: "home" */)
//const veranstaltungComponent = () => import('@components/main/veranstaltungen.vue' /* webpackChunkName: "home" */)

type Lazy<T> = () => Promise<T>
type Translation = Record<string, { route: string, title: string }>

import { Routes } from '@shared/routes'
type Data = {
  component: RouteComponent | Lazy<RouteComponent>
  options?: {
    favicon?: string
  }
}

export class VueRoutes extends Routes<RouteRecordRaw, Data>
{
  constructor()
  {
    super([
      {
        path: "",
        component: () => import('@components/404.vue'),
        meta:
        {
          title: "error404"
        }
      }
    ])
  }

  override addRoute(key: string, data: Data)
  {
    this.keyRoutes.add(key)
    //headerKeys.push(key)
    for (var [lang, translations] of Object.entries(localizedRoutes))
    {
    this.local_routes.get(lang as Language)!.set(key, {
      path: Routes.getKeyPath(key, <Language | undefined>lang),
      component: data.component,
      meta: {
        title: key,//(<Translation>translations)[key].title
        ...data.options
      }
    })
    }
  }

  routerCompilation(): RouteRecordRaw[]
  {
    return [
      {
        path: this.basePaths.home,
        component: defaultLayout,
        children: this.allLocalRoutes()
      },
      {
        path: '/:catchAll(.*)',
        component: defaultLayout,
        children: this.defaultRoutes
      }
    ]
  }
}

export const routes = new VueRoutes()
routes.addRoute('home', { component: homeComponent })
routes.addRoute('representatives', { component: vertreterComponent, options: { favicon: fav2 } })
routes.addRoute('consultationHours', { component: sprechstundenComponent })
routes.addRoute('freshers', { component: erstisComponent, options: { favicon: studentSvg } })
routes.addRoute('noPanic', { component: keinePanikComponent })
//routes.addRoute('blog', blogComponent)
routes.addRoute('election', { component: wahlComponent, options: { favicon: require('@components/main/wal.svg') } })
routes.addRoute('uniCinema', { component: uniKinoComponent, options: { favicon: require('@components/main/filmkamera.svg') } })
routes.addRoute('party', { component: partyComponent, options: { favicon: require('@components/main/party.svg') } })
//routes.addRoute('veranstaltungen', { component: veranstaltungComponent })

routes.addRoute('imprint', { component: impressumComponent })
routes.addRoute('contact', { component: kontaktComponent })
routes.addRoute('externals', { component: externeComponent })


routes.registerCategory([
  'home', 'representatives', 'consultationHours',
  'freshers', 'noPanic', 'election', 'uniCinema',
  'party' //'veranstaltungen'
], 'header')

routes.registerCategory([
  'imprint', 'contact', 'externals'
], 'footer')