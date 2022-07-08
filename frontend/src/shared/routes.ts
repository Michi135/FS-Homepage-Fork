import fav2 from '@static/favicon2.svg'
import studentSvg from '@components/main/student.svg'
import localizedRoutes from './localizedRoutes.json'

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
const veranstaltungComponent = () => import('@components/main/veranstaltungen.vue' /* webpackChunkName: "home" */)

export const basePaths = {
  home: '/',
  dashboard: '/',
  account: '/'
} as const

export let keyRoutes = new Set<string>()

let defaultRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import('@components/404.vue'),
    meta:
    {
      title: "error404"
    }
  }
]

type Lazy<T> = () => Promise<T>
type Translation = Record<string, { route: string, title: string }>

export function getKeyPath(key: string, language: Language = 'de')
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

//addFooterRoute('test', testComponent)
/*
export function sitemap_routes()
{
  Array.from(headerRoutes.values()).flat().concat(Array.from(footerRoutes.values()).flat()).map((val) => {})
}
*/

//key, category
let registeredCategories: Record<string, string[]> = {}

export function getCategory(category: string)
{
  if (category in registeredCategories)
    return registeredCategories[category]
}

export function registerCategory(key: string | string[], category: string)
{
  if (__IS_DEV__)
  {
    //warn registering unkown key
    //warn overriding exisiting one
  }

  const temp = (Array.isArray(key)) ? key : [key]

  if (category in registeredCategories)
    registeredCategories[category].push(...temp)
  else
    registeredCategories[category] = temp
}

//lang, key, route
let local_routes: Map<Language, Map<string, RouteRecordRaw>> = new Map()
local_routes.set('de', new Map())
local_routes.set('en', new Map())

function addRoute(key: string, component: RouteComponent | Lazy<RouteComponent>, misc: { favicon?: string } = {})
{
  keyRoutes.add(key)
  //headerKeys.push(key)
  for (var [lang, translations] of Object.entries(localizedRoutes))
  {
    local_routes.get(lang as Language)!.set(key, {
      path: getKeyPath(key, <Language | undefined>lang),
      component: component,
      meta: {
        title: key,//(<Translation>translations)[key].title
        ...misc
      }
    })
  }
}

addRoute('home', homeComponent)
addRoute('representatives', vertreterComponent, { favicon: fav2 })
addRoute('consultationHours', sprechstundenComponent)
addRoute('freshers', erstisComponent, { favicon: studentSvg })
addRoute('noPanic', keinePanikComponent)
//addRoute('blog', blogComponent)
addRoute('election', wahlComponent, { favicon: require('@components/main/wal.svg') })
addRoute('uniCinema', uniKinoComponent, { favicon: require('@components/main/filmkamera.svg') })
addRoute('party', partyComponent, { favicon: require('@components/main/party.svg') })
addRoute('veranstaltungen', veranstaltungComponent)

addRoute('imprint', impressumComponent)
addRoute('contact', kontaktComponent)
addRoute('externals', externeComponent)


registerCategory([
  'home', 'representatives', 'consultationHours',
  'freshers', 'noPanic', 'election', 'uniCinema',
  'party', 'veranstaltungen'
], 'header')

registerCategory([
  'imprint', 'contact', 'externals'
], 'footer')

function allLocalRoutes()
{
  return Array.from(local_routes.values()).flatMap((val) =>
  {
    return Array.from(val.values())
  })
}

export function allRoutes()
{
  return defaultRoutes.concat(allLocalRoutes())
}

export function routerCompilation(): RouteRecordRaw[]
{
  return [
    {
      path: basePaths.home,
      component: defaultLayout,
      children: allLocalRoutes()
    },
    {
      path: '/:catchAll(.*)',
      component: defaultLayout,
      children: defaultRoutes
    }
  ]
}

export function getRoute(key: string, lang: Language)
{
  return local_routes.get(lang)?.get(key)
}

export function getCategoryRoutes(category: string, lang: Language)
{
  return getCategory(category)?.map((val) =>
  {
    return getRoute(val, lang)!
  })
}