import { configFunction } from '../../vite.config'
import { Router } from 'express'
import ssr from './ssrHMR'
import { fileRequest } from './fileRequest'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { merge } from 'lodash-es'

import fsExtra from "fs-extra"

import { createServer as createViteServer, build } from 'vite'

import type { ViteDevServer } from 'vite'

const { readJson, writeJSON } = fsExtra


export async function clientConfig(development: boolean)
{
  return await configFunction({ isProd: !development, isSSR: true, isServer: false })
}

export async function serverConfig(development: boolean)
{
  return await configFunction({ isProd: !development, isSSR: true, isServer: true })
}

export interface ClientDevBundle {
  devMid: ViteDevServer,
}

export interface ProdBundle {
  compileInstance: ReturnType<typeof build>
}

export async function clientBundle(isDev: boolean)
{
  if (isDev)
    return

  const client = await clientConfig(isDev)

  return <ProdBundle>{
    compileInstance: build({ ...client, configFile: false })
  }
}

export interface ServerDevBundle {
  devMid: ViteDevServer,
}

export async function serverBundle(isDev: boolean)
{
  const server = await serverConfig(isDev)
  if (isDev)
  {
    return <ServerDevBundle>{
      devMid: await createViteServer({
        appType: 'custom',
        configFile: false,
        ...merge(server, { server: { middlewareMode: true } })
      })
    }
  }
  return <ProdBundle>{
    compileInstance: build({ ...server, configFile: false })
  }
}

function manifestRoutes(manifest: Record<string, string>)
{
  let routes: string[] = new Array<string>()
  for (let key in manifest)
  {
    routes.push(manifest[key])
  }
  return routes
}

export class Build
{

  public readonly mDev: boolean
  private mBuilt: boolean
  private mClient: ReturnType<typeof clientBundle>
  private mServer: ReturnType<typeof serverBundle>
  private mRouter: Router = Router()

  constructor(development: boolean)
  {
    this.mDev = development
    this.mBuilt = development

    this.mClient = clientBundle(development)
    this.mServer = serverBundle(development)
  }

  async build()
  {
    try
    {
      if (!this.mBuilt)
      {
        if (!this.mDev)
        {
          await (<ProdBundle>await this.mClient).compileInstance
          await (<ProdBundle>await this.mServer).compileInstance
        }
        console.log("Building process finished")
      }
      //TODO:: fix router
      //await this.constructRouter()
      return this.mRouter
    }
    catch (reason)
    {
      throw "Build failed: " + reason
    }
  }

  private async constructRouter()
  {
    if (this.mDev)
    {
      const { devMid } = <ServerDevBundle>await this.mServer
      this.mRouter.use(devMid.middlewares, (req, res, next) =>
      {
        res.locals = res.locals || {}
        res.locals.vite = devMid
        return next()
      })
    }
    else
    {
      const manifest: Record<string, string> = await readJson(resolve("dist-ssr", 'dist', 'manifest.json'), { encoding: 'utf-8' })
      const ressourceRequest = fileRequest(join(fileURLToPath(import.meta.url), "..", "..", "..", "dist-ssr"))
      this.mRouter.get(manifestRoutes(manifest), ressourceRequest)
    }
    this.mRouter.use(/\/(dist.*|favicon.ico)/, (req, res) =>
    {
      return res.status(404).end()
    })
    this.mRouter.use(ssr())
    this.mRouter.use((req, res) =>
    {
      return res.status(404).end()
    })
  }
}