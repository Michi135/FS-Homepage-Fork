import ssrBase from "./ssrBase"

import { join } from 'path'

import type { NextFunction, Request, Response } from 'express'
import type { Stats, Compiler } from 'webpack'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

interface devMiddleware {
    stats: Stats,
    outputFileSystem: Compiler['outputFileSystem']
};

function loadDevMiddleWare(res: Response)
{
  return <devMiddleware>res.locals?.webpack?.devMiddleware
}

async function loadDom(dev: devMiddleware)
{
  const outputFileSystem = dev!.outputFileSystem
  const jsonWebpackStats = dev!.stats.toJson()
  const { assetsByChunkName, outputPath } = jsonWebpackStats || {}

  return await new Promise<string>((resolve, reject) =>
  {
      outputFileSystem!.readFile(join(outputPath!, 'test.html'), (error, result) =>
      {
        if (error)
          reject(error)
        resolve(result! as string)
      })
  })
}

async function loadManifest(dev: devMiddleware)
{
  const outputFileSystem = dev!.outputFileSystem
  const jsonWebpackStats = dev!.stats.toJson()
  const { assetsByChunkName, outputPath } = jsonWebpackStats || {}

  return await new Promise<Record<string, string>>((resolve, reject) =>
  {
    outputFileSystem!.readFile(join(outputPath!, 'manifest.json'), (error, result) =>
    {
      if (error)
        reject(error)
      resolve(JSON.parse(result! as string))
    })
  })
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

    try
    {
      const devMiddleware = loadDevMiddleWare(res)
      delete require.cache[require.resolve('@distServer/main.js')]

      const domLoad = loadDom(devMiddleware)
      const manifestLoad = loadManifest(devMiddleware)

      //@ts-ignore necessary in case there isn't a compiled main.js
      const bundle = (await import('@distServer/main.js'))
      ssrBase(await domLoad, await manifestLoad, bundle, req, res)
    }
    catch (error)
    {
      console.log(error)
      res.status(500).end("Internal Server Error")
    }
  }
}