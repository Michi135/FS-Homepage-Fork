import { resolve } from 'path'

import fsExtra from 'fs-extra'
import { ensureContext } from '@shared/ssrContext.js'

const { pathExists, readJSON } = fsExtra

async function createDefaultContext()
{
  const filename = 'context.json'
  const fullPath = resolve(".", filename)
  let context
  if (await pathExists(fullPath))
    context = await readJSON(fullPath)

  return ensureContext(context)
}

export { createDefaultContext }