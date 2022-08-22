import localizedRoutes from '@shared/localizedRoutes.json'
import { Routes } from "@shared/routes"

type Language = 'de' | 'en'

export class ServerRoutes extends Routes<string, undefined>
{
  constructor()
  {
    super([""])
  }

  override addRoute(key: string, data: undefined = undefined)
  {
    this.keyRoutes.add(key)
    for (var [lang, translations] of Object.entries(localizedRoutes))
    this.local_routes.
      get(lang as Language)!.
      set(key, Routes.getKeyPath(key, <Language | undefined>lang))
  }
}

export const routes = new ServerRoutes()

routes.addRoute('home')
routes.addRoute('representatives')
routes.addRoute('consultationHours')
routes.addRoute('freshers')
routes.addRoute('noPanic')
//routes.addRoute('blog')
routes.addRoute('election')
routes.addRoute('uniCinema')
routes.addRoute('party')
//routes.addRoute('veranstaltungen')

routes.addRoute('imprint')
routes.addRoute('contact')
routes.addRoute('externals')


routes.registerCategory([
  'home', 'representatives', 'consultationHours',
  'freshers', 'noPanic', 'election', 'uniCinema',
  'party' //'veranstaltungen'
], 'header')

routes.registerCategory([
  'imprint', 'contact', 'externals'
], 'footer')