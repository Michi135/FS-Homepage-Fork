import { SitemapStream, SitemapItem, streamToPromise } from 'sitemap'
import { routes } from './routes'
//import { WriteStream } from 'fs-extra'

let sitemap: Buffer | undefined

export async function getSiteMap(cache: boolean = true)
{
  if(sitemap)
    return sitemap

  await createSiteMap()
  return sitemap!
}

export async function createSiteMap()
{
  let stream = new SitemapStream({ hostname: "https://fsmpi.uni-bayreuth.de" })
  const baseUrl = "https://fsmpi.uni-bayreuth.de/"

  const localRoutes = routes.getLocalRoutes()
  for (var [key, route] of localRoutes.get('de')!)
  {
    let entry: SitemapItem = { url: baseUrl + route, img: [], video: [], links: [] }

    for (var lang of ['en'])
    {
      entry.links = entry.links.concat({
        lang: lang,
        url: baseUrl + localRoutes.get(lang as 'en')?.get(key)
      })
    }
    stream.write(entry)
  }

  const pro = streamToPromise(stream).then(sm => sitemap = sm)

  stream.end()
  await pro
  //stream.pipe(res).on('error', (e) => {throw e})
}