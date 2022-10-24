import ssrBase from "./ssrBase"
//import { createRequire } from 'module'
//const require = createRequire(import.meta.url)
import { JSDOM } from 'jsdom'

import type { NextFunction, Request, Response } from 'express'
import type { ViteDevServer } from 'vite'


interface devMiddleware {
  vite: ViteDevServer
};

function loadDevMiddleWare(res: Response)
{
  return <devMiddleware>{ vite: res.locals!.vite }
}

import rawHtml from '../indexHtml'


export default function ssr()
{
  return async function (req: Request, res: Response, next: NextFunction)
  {
    if (!req.accepts('html') || req.method !== 'GET')
    {
      next()
      return
    }

    const devMiddleware = loadDevMiddleWare(res)
    try
    {
      const html = await devMiddleware.vite.transformIndexHtml(req.originalUrl, rawHtml)
      const dom = new JSDOM(html)
      dom.window.document.head.innerHTML += `<script type="module" src="/src/client/main.ts"></script>`

      const bundle = await devMiddleware.vite.ssrLoadModule('src/shared/app.ts')
      ssrBase(dom, {}, bundle, req, res)
    }
    catch (error)
    {
      //@ts-ignore
      devMiddleware.vite.ssrFixStacktrace(error)
      console.log(error)
      res.status(500).end("Internal Server Error")
    }
  }
}