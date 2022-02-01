import { SSRContext } from '@vue/server-renderer'
import { resolve } from 'path'


import fsExtra from 'fs-extra'
const { pathExists, readJSON } = fsExtra;

async function createDefaultContext(): Promise<SSRContext> {

    const filename = 'context.json'
    const fullPath = resolve(".", filename)
    if (await pathExists(fullPath))
        return await readJSON(fullPath)
    else return {}
}

export { createDefaultContext };