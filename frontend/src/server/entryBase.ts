import 'dotenv/config'

import express, { json } from 'express'
import { createServer } from 'http'
import process from 'process'

import helmet, { contentSecurityPolicy } from 'helmet'
import cors from 'cors'

import { uniNet, cspNonce } from './middlewareTools.js'
import { getSiteMap } from './sitemapF.js'

import type { IncomingMessage, ServerResponse } from 'http'

const server = express()

export function cleanExit(...cleanups: Function[])
{
  console.log("Gracefully shutting down")
  for (let i = 0; i < cleanups.length; ++i)
    (cleanups[i])()

  console.log("Goodbye")
  process.exit()
};

async function base(isDev: boolean)
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
    contentSecurityPolicy: (isDev) ? false : {
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

  return {
    server
  }
}


export default base