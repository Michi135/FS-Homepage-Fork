import { SSRContext } from '@vue/server-renderer'
import { resolve } from 'path'
import { pathExists, readJSON } from 'fs-extra'

async function createDefaultContext(): Promise<SSRContext> {

    const filename = 'context.json'
    const fullPath = resolve(__dirname, filename)
    if (await pathExists(fullPath))
        return await readJSON(fullPath)
    else return {}
}

export { createDefaultContext };