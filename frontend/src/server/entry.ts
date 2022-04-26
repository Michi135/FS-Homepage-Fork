import 'dotenv/config'
import express, { json } from 'express'
import { createServer } from 'http'
import process from 'process'

import helmet, { contentSecurityPolicy, crossOriginEmbedderPolicy } from 'helmet'
import cors from 'cors'
import crypto from 'crypto'

import { Netmask } from 'netmask'

import { Build } from './runtimeConfig'

import type { IncomingMessage, ServerResponse } from 'http'

const isDev = (process.env.NODE_ENV || 'development') === 'development'
const server = express()
const uniMask = new Netmask("132.180.0.1/16")

//https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking

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
    const build = new Build(isDev).build()

    server.use(json())
    server.use(cors(
      {
        //origin: true
        //origin: ['https://fsmpi.uni-bayreuth.de']
      })
    )
    server.use((req, res, next) =>
    {
      const ip = req.headers["x-forwarded-for"]

      if (typeof ip === "string")
        res.locals.isUni = uniMask.contains(ip)
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
      return res.status(200).send(`User-agent: AdsBot-Google
    Disallow: /`)
    //TODO:: improve discoverability with sitemap
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


    server.use(await build)

  }
  catch (reason)
  {
    console.log("Critical error " + reason)
    cleanExit()
  }
})()