import 'dotenv/config'
import express, { json } from 'express'
import { createServer } from 'http'
import process from 'process'

import helmet, { contentSecurityPolicy, crossOriginEmbedderPolicy } from 'helmet'
import cors from 'cors'

import { uniNet, cspNonce } from './middlewareTools'

import ssr from './ssrProduction'

import { getSiteMap } from './sitemapF'
import manifest from '@distClient/manifest.json'

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

//https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking

function manifestRoutes(manifest: Record<string, { file: string }>)
{
  const base = "/dist/"
  const out = new Set<string>()
  Object.entries(manifest).forEach(([key, assets]) =>
  {
    out.add(base + assets.file)
    /*assets.forEach((asset) =>
    {
      out.add(asset)
    })*/
  })
  return [...out]
}

async function staticContent(expressApp: Express)
{
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
    server.use(uniNet, cspNonce)

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
