import localizedRoutes from './localizedRoutes'

type Language = 'de' | 'en'

type Lazy<T> = () => Promise<T>
type Translation = Record<string, { route: string, title: string }>

export class Routes<T, S = undefined>
{
  readonly basePaths =
    {
      home: '/',
      dashboard: '/',
      account: '/'
    }

  keyRoutes = new Set<string>()
  defaultRoutes: T[] = []
  registeredCategories: Record<string, string[]> = {}
  local_routes: Map<Language, Map<string, T>> = new Map()

  static getKeyPath(key: string, language: Language = 'de')
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

  getCategory(category: string)
  {
    if (category in this.registeredCategories)
      return this.registeredCategories[category]
  }

  registerCategory(key: string | string[], category: string)
  {
    /*if (__IS_DEV__)
    {
    //warn registering unkown key
    //warn overriding exisiting one
    }*/

    const temp = (Array.isArray(key)) ? key : [key]

    if (category in this.registeredCategories)
      this.registeredCategories[category].push(...temp)
    else
      this.registeredCategories[category] = temp
  }

  getLocalRoutes()
  {
    return this.local_routes
  }

  addRoute(key: string, data: S | undefined)
  {}

  allLocalRoutes()
  {
    return Array.from(this.local_routes.values()).flatMap((val) =>
    {
      return Array.from(val.values())
    })
  }

  allRoutes()
  {
    return this.defaultRoutes.concat(this.allLocalRoutes())
  }

  getRoute(key: string, lang: Language)
  {
    return this.local_routes.get(lang)?.get(key)
  }

  getCategoryRoutes(category: string, lang: Language)
  {
    return this.getCategory(category)?.map((val) =>
    {
      return this.getRoute(val, lang)!
    })
  }

  constructor(defaultRoutes: T[])
  {
    this.defaultRoutes = defaultRoutes
    this.local_routes.set('de', new Map())
    this.local_routes.set('en', new Map())
  }
}