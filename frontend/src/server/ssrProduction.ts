import ssrBase from './ssrBase.js'
//@ts-ignore
import * as bundle from '@distServer/app.mjs'
import ssrManifest from '@distClient/ssr-manifest.json' assert { type: 'json'}
import manifest from '@distClient/manifest.json' assert { type: 'json'}
import html from '../indexHtml.js'

import { JSDOM } from 'jsdom'

import type { NextFunction, Request, Response } from 'express'


export default function ssr()
{
  return async function (req: Request, res: Response, next: NextFunction)
  {
    if (!req.accepts('html') || req.method !== 'GET')
      return next()

    try
    {
      const dom = new JSDOM(html)
      dom.window.document.head.innerHTML +=
      `
        <link rel="stylesheet" href="/dist/${manifest['src/client/main.ts'].css}" />
        <script type="module" src="/dist/${manifest["src/client/main.ts"].file}"></script>
      `
      ssrBase(dom, ssrManifest, bundle, req, res)
    }
    catch (error)
    {
      console.log(error)
      return res.status(500).end("Internal Server Error")
    }
  }
}