import fav2 from '@static/favicon2.svg'
import studentSvg from '@components/main/student.svg'
import localizedRoutes from './localizedRoutes.json'

import type { RouteComponent, RouteRecordRaw } from 'vue-router'

const defaultLayout = () => import('@components/main/layout/content.vue'/* webpackChunkName: "home" */)
const homeComponent = () => import('@components/main/home.vue'/* webpackChunkName: "home" */)
const vertreterComponent = () => import('@components/main/vertreter/vertreter.vue'/* webpackChunkName: "home" */)
const erstisComponent = () => import('@components/main/erstis.vue'/* webpackChunkName: "home" */)
const keinePanikComponent = () => import('@components/main/panik.vue'/* webpackChunkName: "home" */)
const externeComponent = () => import('@components/main/externals.vue'/* webpackChunkName: "home" */)
const blogComponent = () => import('@components/main/blog.vue' /* webpackChunkName: "home" */)
const uniKinoComponent = () => import('@components/main/uniKino.vue' /* webpackChunkName: "home" */)


const impressumComponent = () => import('@components/main/impressum.vue'/* webpackChunkName: "footer" */)
const sprechstundenComponent = () => import('@components/main/sprechstunden/sprechstunden.vue'/* webpackChunkName: "footer" */)
const kontaktComponent = () => import('@components/main/kontakt.vue'/* webpackChunkName: "footer" */)
const testComponent = () => import('@components/editor/editor.vue' /* webpackChunkName: "footer" */)
const wahlComponent = () => import('@components/main/hochschulwahl.vue'/* webpackChunkName: "home" */)

export const basePaths = {
  home: '/',
  dashboard: '/',
  account: '/'
} as const

let headerRoutes: Map<string, RouteRecordRaw[]> = new Map()
headerRoutes.set('de', [])
headerRoutes.set('en', [])

let footerRoutes: Map<string, RouteRecordRaw[]> = new Map()
footerRoutes.set('de', [])
footerRoutes.set('en', [])

let routes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import('@components/404.vue'),
    meta:
    {
      title: "error404"
    }
  }
]
export { headerRoutes, footerRoutes }

export function allRoutes()
{
  return routes.concat(Array.from(headerRoutes.values()).flat()).concat(Array.from(footerRoutes.values()).flat())
}

type Lazy<T> = () => Promise<T>
type Translation = Record<string, { route: string, title: string }>

export function getHeaderRoutes(lang: 'de' | 'en')
{
  return headerRoutes.get(lang)!
}

export function getFoorterRoutes(lang: 'de' | 'en')
{
  return footerRoutes.get(lang)!
}

function addHeaderRoute(key: string, component: RouteComponent | Lazy<RouteComponent>, misc: { favicon?: string } = {})
{
  //headerKeys.push(key)
  for (var [lang, translations] of Object.entries(localizedRoutes))
  {
    let path = ""
    if (lang && lang !== 'de')
      path += lang + '/'

    if (!(<Translation>translations)[key])
      path += key
    else
      path += (<Translation>translations)[key].route

    headerRoutes.get(lang)!.push({
      path: path,
      component: component,
      meta: {
        title: key,//(<Translation>translations)[key].title
        ...misc
      }
    })
  }
}

function addFooterRoute(key: string, component: RouteComponent | Lazy<RouteComponent>, misc: { favicon?: string } = {})
{
  //headerKeys.push(key)
  for (var [lang, translations] of Object.entries(localizedRoutes))
  {
    /*let path = ""
    if (lang && lang !== 'de')
      path += lang + '/'

    if (!(<Translation>translations)[key])
      path += key
    else
      path += (<Translation>translations)[key].route*/

    footerRoutes.get(lang)!.push({
      path: getKeyPath(key, <'de' | 'en' | undefined>lang),
      component: component,
      meta: {
        title: key,//(<Translation>translations)[key].title
        ...misc
      }
    })
  }
}

export function getKeyPath(key: string, language: 'de' | 'en' = 'de')
{
  const entry = <Translation>localizedRoutes[language]
  let path = ""
  if (language !== 'de')
    path += language + '/'

  if (!entry[key])
    path += key
  else
    path += entry[key].route

  return path
}

addHeaderRoute('home', homeComponent)
addHeaderRoute('representatives', vertreterComponent, { favicon: fav2 })
addHeaderRoute('freshers', erstisComponent, { favicon: studentSvg })
addHeaderRoute('noPanic', keinePanikComponent)
addHeaderRoute('externals', externeComponent)
addHeaderRoute('blog', blogComponent)
addHeaderRoute('election', wahlComponent, { favicon: require('@components/main/wal.svg') })
addHeaderRoute('uniCinema', uniKinoComponent, { favicon: require('@components/main/filmkamera.svg') })

addFooterRoute('imprint', impressumComponent)
addFooterRoute('consultationHours', sprechstundenComponent)
addFooterRoute('contact', kontaktComponent)
addFooterRoute('test', testComponent)

export function routerCompilation(): RouteRecordRaw[]
{
  return [
    {
      path: basePaths.home,
      component: defaultLayout,
      children: Array.from(headerRoutes.values()).flat().concat(Array.from(footerRoutes.values()).flat())
    },
    {
      path: '/:catchAll(.*)',
      component: defaultLayout,
      children: routes
    }
  ]
}