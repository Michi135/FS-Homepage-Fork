import { createDefaultContext } from './context'
import { renderToString } from '@vue/server-renderer'
//import { getStyles } from './cdn.config'
import { getMeta } from './meta.config'
import { createFaviconLink } from '@shared/favicon'
import { determineLanguage } from '@shared/util'
import { JSDOM } from 'jsdom'
import { exportStates } from '@vue/apollo-ssr'
import { brotliCompressSync, gzipSync } from 'zlib'
import devalue from '@nuxt/devalue'

import jsonwt from 'jsonwebtoken'
const { sign } = jsonwt

import type { Request, Response } from 'express'
//import type { createDefaultApp as CA, nw2PartyEvent as NWE } from '@shared/app'

//export type AppType = typeof App

import { env } from 'process'
import type { SSRContext } from '@shared/ssrContext'

//TODO:: fix
const chunks: Record<string, string> = {
  "/": "home",
  "/vertreter": "home",
  "/keinePanik": "home",
  "/externeLinks": "footer",
  "/impressum": "footer",
  "/sprechstunden": "home",
  "/kontakt": "footer",
  "/erstis": "home",
  "/wahl": "home",
  "/uniKino": "home",
  "/nw2-party": "home",

  "/en": "home",
  "/en/representatives": "home",
  "/en/freshers": "home",
  "/en/noPanic": "home",
  "/en/externalLinks": "footer",
  "/en/imprint": "footer",
  "/en/consultationHours": "home",
  "/en/contact": "footer",
  "/en/uniCinema": "home",
  "/en/nw2-party": "home"
}

let networkToken: string | undefined

function getNetworkToken()
{
  if (!networkToken) //TODO:: env secret, shared between frontendserver and backendserver
    networkToken = sign({ fromServer: true }, env.JWT_SECRET_SHARED ?? 'DEFAULT_JWT_SECRET')
  return networkToken
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

function addStyles(dom: JSDOM, styles: SSRContext["styles"])
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

function addEvents(dom: JSDOM, events: SSRContext["events"], nonce: string)
{
  const doc = dom.window.document
  const head = doc.head

  for (let [id, event] of Object.entries(events))
  {
    const node = doc.createElement('script')
    node.id = id
    node.type = "application/ld+json"
    node.innerHTML = JSON.stringify(event)
    node.nonce = nonce
    head.append(node)
  }
}

export default async function ssr(htmlBlueprint: string, manifest: Record<string, string>, bundle: any, req: Request, res: Response)
{
  const contextLoad = createDefaultContext()
  const language = determineLanguage(req.path)

  const nonce: string = res.locals.cspNonce

  let args = { ctx: { language: language, isUniNetwork: res.locals!.isUni, nonce: nonce } }

  if (res.locals?.isUni)
    args = Object.assign(args, { networkToken: getNetworkToken() })

  const { createDefaultApp } = bundle
  const { router, app, pinia, apolloClients } = createDefaultApp(args)

  router.push(req.url)
  await router.isReady()

  const currentRoute = router.currentRoute.value
  if (!currentRoute.matched.length) return res.status(404).end()

  const dom = new JSDOM(htmlBlueprint)

  const doc = dom.window.document
  const head = doc.head
  doc.children[0].setAttribute('lang', language)

  /*
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

  /*if (req.url === "/")
  {
    const preloadImg = manifest['plakat.jpg']
    const nodeImg = doc.createElement("link")
      nodeImg.setAttribute('href', preloadImg)
      nodeImg.setAttribute('rel', 'preload')
      nodeImg.setAttribute('as', 'image')
      head.appendChild(nodeImg)
    }*/

  const context = await contextLoad
  context.nonce = nonce
  doc.getElementById('app')!.innerHTML = await renderToString(app, context)
  console.log(context)

  addStyles(dom, context.styles)
  addEvents(dom, context.events, nonce)
  head.innerHTML += `<title>${context.title}</title>`
  head.innerHTML += getMeta()
  head.innerHTML += createFaviconLink(context.favicon!)
  //head.innerHTML += getStyles();

  /*if (res.locals?.isUni)
    {
      const condScript = doc.createElement('script')
      head.appendChild(condScript)
    }*/
  head.innerHTML += `<script nonce="${nonce}">window.__INITIAL_STATE__=${devalue(pinia.state.value)}</script>`
  head.innerHTML += `<script nonce="${nonce}">${exportStates(apolloClients)}</script>`

  const document = dom.serialize()

  res.type('html')
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