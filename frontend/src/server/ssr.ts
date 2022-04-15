import { createDefaultContext } from '@shared/context'
import { renderToString } from '@vue/server-renderer'
//import { getStyles } from './cdn.config'
import { getMeta } from './meta.config'
import { createFaviconLink } from '../favicon/favicon'
import { JSDOM } from 'jsdom'
import { join, resolve } from 'path'
import { exportStates } from '@vue/apollo-ssr'
import { brotliCompressSync, gzipSync } from 'zlib'
import devalue from '@nuxt/devalue'

import jsonwt from 'jsonwebtoken'
const { sign } = jsonwt

import fsExtra from 'fs-extra'
const { readJson, readFile } = fsExtra

//TODO:: improve
import { createRequire } from 'module'
const require = createRequire(import.meta.url)


import type { NextFunction, Request, Response } from 'express'
import type { Stats, Compiler } from 'webpack'
import type * as App from '@shared/app'

interface devMiddleware {
    stats: Stats,
    outputFileSystem: Compiler['outputFileSystem']
};

const chunks: Record<string, string> = {
  "/": "home",
  "/vertreter": "home",
  "/keinePanik": "home",
  "/externe": "home",
  "/impressum": "footer",
  "/sprechstunden": "footer",
  "/kontakt": "footer",
  "/erstis": "home",
  "/wahl": "home"
}

let initialHtml: string | undefined
let initialManifest: Record<string, string> | undefined
let networkToken: string | undefined

function getNetworkToken()
{
  if (!networkToken) //TODO:: env secret, shared between frontendserver and backendserver
    networkToken = sign({ fromServer: true }, 'klandfgjklandfskjhgaksjdnlkösajkdfoijasldkjflkasdnfasoiehjo')
  return networkToken
}

async function loadDom(dev?: devMiddleware)
{
  if (dev)
  {
    const outputFileSystem = dev!.outputFileSystem
    const jsonWebpackStats = dev!.stats.toJson()
    const { assetsByChunkName, outputPath } = jsonWebpackStats || {}

    initialHtml = await new Promise<string>((resolve, reject) =>
    {
      outputFileSystem!.readFile(join(outputPath!, 'test.html'), (error, result) =>
      {
        if (error)
          reject(error)
        resolve(result! as string)
      })
    })
  }
  else if (typeof initialHtml === "undefined")
    initialHtml = (await readFile('./dist-ssr/dist/test.html', { encoding: 'utf-8' }))
  return initialHtml
}

async function loadManifest(dev?: devMiddleware)
{
  if (dev)
  {
    const outputFileSystem = dev!.outputFileSystem
    const jsonWebpackStats = dev!.stats.toJson()
    const { assetsByChunkName, outputPath } = jsonWebpackStats || {}

    initialManifest = await new Promise<Record<string, string>>((resolve, reject) =>
    {
      outputFileSystem!.readFile(join(outputPath!, 'manifest.json'), (error, result) =>
      {
        if (error)
          reject(error)
        resolve(JSON.parse(result! as string))
      })
    })
  }
  else if (typeof initialManifest === "undefined")
    initialManifest = await readJson(resolve("dist-ssr", 'dist', 'manifest.json'), { encoding: 'utf-8' })
  return (initialManifest!)
}

/*function swap<A extends keyof any, B extends keyof any>(json: Record<A, B>)
{
  var ret: Record<B, A> = new Object as Record<B, A>
  for (var key in json)
  {
    ret[json[key]] = key
  }
  return ret
}*/
/*
const supportedLanguages =
    ['de',
      'en']
*/
/*function getLanguage(req: Request)
{
  const lang = req.acceptsLanguages(supportedLanguages)
  return <'en' | 'de'>(lang ? lang : 'en')
}*/

function loadDevMiddleWare(res: Response)
{
  const devMiddleware = res.locals?.webpack?.devMiddleware
  return (!!devMiddleware) ? <devMiddleware>devMiddleware : undefined
}

function addStyles(dom: JSDOM, styles: Record<string, string>)
{
  const doc = dom.window.document
  const head = doc.head

  for (let [id, css] of Object.entries(styles))
  {
    const node = doc.createElement('style')
    node.id = id
    node.innerHTML = css
    head.append(node)
  }
}

export default function ssr(dev: boolean)
{
  return async function (req: Request, res: Response, next: NextFunction)
  {
    if (!req.accepts('html') || req.method !== 'GET')
      return next()

    try
    {
      const devMiddleware = loadDevMiddleWare(res)
      if (dev) delete require.cache[require.resolve('@distServer/main.js')]

      const domLoad = loadDom(devMiddleware)
      const manifestLoad = loadManifest(devMiddleware)
      const contextLoad = createDefaultContext()

      res.contentType('html')
      res.charset = 'utf-8'

      let language: 'de' | 'en' = 'de'
      {
        const testLang = req.path.match(/^\/([^\/]*)/)
        if (testLang?.length === 2 && ['en'].includes(testLang.at(1)!))
          language = <'en'>testLang.at(1)!
      }
      let args = { ctx: { language: language, isUniNetwork: res.locals!.isUni } }

      if (res.locals?.isUni) //TODO:: wieder entkommentieren
        args = Object.assign(args, { networkToken: getNetworkToken() })

      //@ts-ignore necessary in case there isn't a compiled main.js
      const { createDefaultApp } = <typeof App>(await import('@distServer/main.js'))
      const { router, app, pinia, apolloClients } = createDefaultApp(args)

      router.push(req.url)
      await router.isReady()

      const currentRoute = router.currentRoute.value
      if (!currentRoute.matched.length) return res.status(404).end()

      const manifest = await manifestLoad
      const dom = new JSDOM(await domLoad)

      const doc = dom.window.document
      const head = doc.head
      doc.children[0].setAttribute('lang', language)

      const chunk = chunks[req.url]
      if (chunk)
      {
        const preloadCss = manifest[chunk + '.css']
        const nodeCss = doc.createElement('link')
        nodeCss.setAttribute('href', preloadCss)
        nodeCss.setAttribute('rel', 'stylesheet')
        head.appendChild(nodeCss)

        const preloadJs = manifest[chunk + '.js']
        const nodeJs = doc.createElement('script')
        nodeJs.setAttribute('src', preloadJs)
        nodeJs.setAttribute('type', 'text/javascript')
        head.appendChild(nodeJs)
      }

      if (req.url === "/")
      {
        const preloadImg = manifest['plakat.jpg']
        const nodeImg = doc.createElement("link")
        nodeImg.setAttribute('href', preloadImg)
        nodeImg.setAttribute('rel', 'preload')
        nodeImg.setAttribute('as', 'image')
        head.appendChild(nodeImg)
      }

      const context = await contextLoad
      doc.getElementById('app')!.innerHTML = await renderToString(app, context)

      addStyles(dom, context.styles)
      head.innerHTML += `<title>${context.title}</title>`
      head.innerHTML += getMeta()
      head.innerHTML += createFaviconLink(context.favicon)
      //head.innerHTML += getStyles();

      /*if (res.locals?.isUni)
      {
        const condScript = doc.createElement('script')
        head.appendChild(condScript)
      }*/
      head.innerHTML += `<script nonce="${res.locals.cspNonce}">window.__INITIAL_STATE__=${devalue(pinia.state.value)}</script>`
      head.innerHTML += `<script nonce="${res.locals.cspNonce}">${exportStates(apolloClients)}</script>`

      const document = dom.serialize()

      if (req.acceptsEncodings(['br']))
      {
        res.setHeader('Content-Encoding', "br")
        res.send(brotliCompressSync(document)).end()
      }
      else if (req.acceptsEncodings(['gzip']))
      {
        res.setHeader('Content-Encoding', "gzip")
        res.send(gzipSync(document)).end()
      }
      else
        res.send(document).end()

    }
    catch (error)
    {
      console.log(error)
      return res.status(500).end("Internal Server Error")
    }
  }
}