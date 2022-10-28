import base, { cleanExit } from './entryBase'

//production only
import ssr from './ssrProduction'
import manifest from '@distClient/manifest.json'

import path from 'path'
const { join } = path

import { fileRequest } from './fileRequest'
import { fileURLToPath } from 'url'

import type { Express } from 'express-serve-static-core'

process.env.NODE_ENV = 'production'

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

//add forbiden/authenticated routes

(async () =>
{
  try
  {
    const { server } = await base(false)
    await staticContent(server)
    server.use(ssr())
  }
  catch (reason)
  {
    console.log("Critical error " + reason)
    cleanExit()
  }
})()
