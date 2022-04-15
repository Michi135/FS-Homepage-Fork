import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import configFunction from '../../webpack.vue.config'
import { Router } from 'express'
import ssr from './ssr'
import { fileRequest } from './fileRequest'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

import fsExtra from "fs-extra"
import webpackM from 'webpack'

const { readJson, writeJSON } = fsExtra
const { webpack } = webpackM

export function clientConfig(development: boolean)
{
  const mode = (development) ? 'development' : 'production'

  return configFunction({ rendering: 'ssr', mode: mode })
}

export function serverConfig(development: boolean)
{
  const mode = (development) ? 'development' : 'production'
  return configFunction({ rendering: 'ssr', target: 'server', mode: mode })
}

export interface ClientDevBundle {
    devMid: ReturnType<typeof webpackDevMiddleware>,
    devHot: ReturnType<typeof webpackHotMiddleware>
}

export interface ProdBundle {
    compileInstance: Promise<void>
}

export function clientBundle(isDev: boolean)
{
  const client = clientConfig(isDev)
  const clientCompiler = webpack(client)

  if (isDev)
  {
    return <ClientDevBundle>{
      devMid: webpackDevMiddleware(clientCompiler,
        {
          publicPath: (client.output!.publicPath as string)
          //serverSideRender: true,
        }),
      devHot: webpackHotMiddleware(clientCompiler)
    }
  }

  return <ProdBundle>{
    compileInstance: new Promise<void>((resolve, reject) =>
    {
      clientCompiler.run((error, stats) =>
      {
        console.log("Client finished building")
        //writeJSON('./stats/stats.json', stats?.toJson())
        if (stats?.hasErrors())
          reject(stats?.compilation.errors)
        resolve()
      })
    })
  }
}

export interface ServerDevBundle {
    devMid: ReturnType<typeof webpackDevMiddleware>,
}

export function serverBundle(isDev: boolean)
{

  const server = serverConfig(isDev)
  const serverCompiler = webpack(server)

  if (isDev)
  {
    return <ServerDevBundle>{
      devMid: webpackDevMiddleware(serverCompiler,
        {
          publicPath: (server.output!.publicPath as string),
          writeToDisk: true
          //serverSideRender: true
        })
    }
  }
  return <ProdBundle>{
    compileInstance: new Promise<void>((resolve, reject) =>
    {
      serverCompiler.run((error, stats) =>
      {
        console.log("Server finished building")
        if (stats?.hasErrors())
          reject(stats?.compilation.errors)
        resolve()
      })
    })
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
          await (<ProdBundle>this.mClient).compileInstance
        }

        await (<ProdBundle>this.mServer).compileInstance
        console.log("Building process finished")
      }
      await this.constructRouter()
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
      const { devMid, devHot } = <ClientDevBundle>this.mClient
      this.mRouter.use(devMid, (req, res, next) =>
      {
        res.locals = res.locals || {}
        res.locals.webpack = res.locals.webpack || {}
        res.locals.webpack.devMiddleware = devMid.context
        return next()
      })
      this.mRouter.use(devHot)
      this.mRouter.use((<ServerDevBundle>this.mServer).devMid)
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
    this.mRouter.use(ssr(this.mDev))
    this.mRouter.use((req, res) =>
    {
      return res.status(404).end()
    })
  }
}