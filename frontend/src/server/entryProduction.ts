import 'dotenv/config'
import express, { json } from 'express'
import { createServer } from 'http'
import process from 'process'

import helmet, { contentSecurityPolicy, crossOriginEmbedderPolicy } from 'helmet'
import cors from 'cors'
import crypto from 'crypto'

import { Netmask } from 'netmask'

import ssr from './ssrProduction'

import { getSiteMap } from './sitemapF'

import type { IncomingMessage, ServerResponse } from 'http'

import fsExtra from 'fs-extra'
import path from 'path'
const { readJson } = fsExtra
const { resolve, join } = path

import { fileRequest } from './fileRequest'
import { fileURLToPath } from 'url'

import type { Express } from 'express-serve-static-core'

process.env.NODE_ENV = 'production'

//const isDev = ( || 'development') === 'development'

//if (!isDev && )
//const baseDir = dirname(resolve("./package.json"))
//console.log(existsSync(baseDir + "/dist-ssr/dist/manifest.json") && existsSync(baseDir + "/dist-ssr/server/main.js"))// && )

const server = express()
const uniMask = new Netmask("132.180.0.1/16")
const fsLanMask = new Netmask("172.16.0.1/16")

//https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking

function manifestRoutes(manifest: Record<string, string>)
{
  let routes: string[] = new Array<string>()
  for (let key in manifest)
  {
    routes.push(manifest[key])
  }
  return routes
}

async function staticContent(expressApp: Express)
{
  const manifest: Record<string, string> = await readJson(resolve("dist-ssr", 'dist', 'manifest.json'), { encoding: 'utf-8' })
  const ressourceRequest = fileRequest(join(fileURLToPath(import.meta.url), "..", "..", "..", "dist-ssr"))
  expressApp.get(manifestRoutes(manifest), ressourceRequest)
}

function cleanExit(...cleanups: Function[])
{
  console.log("Gracefully shutting down")
  for (let i = 0; i < cleanups.length; ++i)
    (cleanups[i])()

  console.log("Goodbye")
  process.exit()
};

//add forbiden/authenticated routes

(async () =>
{
  try
  {
    server.use(json())
    server.use(cors(
      {
        //origin: true
        //origin: ['https://fsmpi.uni-bayreuth.de']
      })
    )
    server.use((req, res, next) =>
    {
      const ip = req.headers["x-real-ip"]

      if (typeof ip === "string")
        res.locals.isUni = uniMask.contains(ip) || fsLanMask.contains(ip)
      else
        res.locals.isUni = false
      next()
    })

    server.use((req, res, next) =>
    {
      res.locals.cspNonce = crypto.randomBytes(40).toString('base64url').substring(0, 40)
      next()
    })

    server.use(helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [...(contentSecurityPolicy.getDefaultDirectives()["script-src"]), (req: IncomingMessage, res: ServerResponse) =>
          {
            //@ts-ignore
            return `'nonce-${res.locals.cspNonce}'`
          }]
        }
      },
      crossOriginEmbedderPolicy: false
      //crossOriginOpenerPolicy: false
    }))
    server.use('/robots.txt', (req, res) =>
    {
      res.contentType("text/plain")
      return res.status(200).send(`User-agent: *
Allow: /
      
Sitemap: https://fsmpi.uni-bayreuth.de/sitemap.xml`)
    })

    server.get('/sitemap.xml', async function(req, res)
    {
      res.header('Content-Type', 'application/xml')
      //res.header('Content-Encoding', 'gzip')
      // if we have a cached entry send it

      try
      {
        res.send(await getSiteMap())
        return
      }
      catch (e)
      {
        console.error(e)
        res.status(500).end()
      }
    })

    const httpServer = createServer(server)
    httpServer.listen(5000)
    console.log("Listening")

    const exitHandler = () =>
    {
      cleanExit(
        () =>
        {
          httpServer.close()
        }
      )
    }
    process.on('SIGINT', exitHandler)
    process.on('SIGTERM', exitHandler)

    await staticContent(server)
    server.use(ssr())
  }
  catch (reason)
  {
    console.log("Critical error " + reason)
    cleanExit()
  }
})()
