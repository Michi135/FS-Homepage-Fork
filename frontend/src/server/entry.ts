import base, { cleanExit } from './entryBase.js'

import { Build } from './runtimeConfig.js'
//https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
//add forbiden/authenticated routes
process.env.NODE_ENV = 'development';

(async () =>
{
  try
  {
    const build = new Build(true).build()
    const { server } = await base(true)
    server.use(await build)
  }
  catch (reason)
  {
    console.log("Critical error " + reason)
    cleanExit()
  }
})()
