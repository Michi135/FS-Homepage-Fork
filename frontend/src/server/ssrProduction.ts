import ssrBase from './ssrBase'
//@ts-ignore
import * as bundle from '@distServer/app.mjs'

import { resolve } from 'path'

import fsExtra from 'fs-extra'
const { readJson, readFile } = fsExtra

import type { NextFunction, Request, Response } from 'express'

let initialHtml: string | undefined
let initialManifest: Record<string, string> | undefined

async function loadDom()
{
  if (typeof initialHtml === "undefined")
    initialHtml = (await readFile('./dist-ssr/dist/test.html', { encoding: 'utf-8' }))
  return initialHtml
}

async function loadManifest()
{
  if (typeof initialManifest === "undefined")
    initialManifest = await readJson(resolve("dist-ssr", 'dist', 'manifest.json'), { encoding: 'utf-8' })
  return (initialManifest!)
}

export default function ssr()
{
  return async function (req: Request, res: Response, next: NextFunction)
  {
    if (!req.accepts('html') || req.method !== 'GET')
      return next()

    try
    {
      const domLoad = loadDom()
      const manifestLoad = loadManifest()
      ssrBase(await domLoad, await manifestLoad, bundle, req, res)
    }
    catch (error)
    {
      console.log(error)
      return res.status(500).end("Internal Server Error")
    }
  }
}