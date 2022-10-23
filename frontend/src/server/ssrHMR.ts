import ssrBase from "./ssrBase"

import { join, resolve } from 'path'

import type { NextFunction, Request, Response } from 'express'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import type { ViteDevServer } from 'vite'

import fsExtra from 'fs-extra'
const { readFile } = fsExtra

interface devMiddleware {
  vite: ViteDevServer
};

function loadDevMiddleWare(res: Response)
{
  return <devMiddleware>{ vite: res.locals!.vite }
}

async function loadDom(dev: devMiddleware)
{
  console.log()

  return readFile(
    resolve('./src/', 'index.html'),
    'utf-8'
  )
}


async function loadManifest(dev: devMiddleware)
{
  /*
  return await new Promise<Record<string, string>>((resolve, reject) =>
  {
    outputFileSystem!.readFile(join(outputPath!, 'manifest.json'), (error, result) =>
    {
      if (error)
        reject(error)
      resolve(JSON.parse(result! as string))
    })
  })
  */
  return {}
}

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
      //delete require.cache[require.resolve('@distServer/main.mjs')]

      const domLoad = loadDom(devMiddleware)
      const html = devMiddleware.vite.transformIndexHtml(req.originalUrl, await domLoad)
      //const manifestLoad = loadManifest(devMiddleware)

      //@ts-ignore necessary in case there isn't a compiled main.js
      const bundle = await devMiddleware.vite.ssrLoadModule('src/shared/app.ts')
      ssrBase(await html, {}, bundle, req, res)
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