import { Build } from './runtimeConfig.js'
import { gzip as gzipRaw, brotliCompress, constants } from 'zlib'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { parse, join, type ParsedPath } from 'path'

import fsExtra from 'fs-extra'
const { readFile, writeFile } = fsExtra

const brotli = promisify(brotliCompress)
const gzip = promisify(gzipRaw)

function getGeneratedFiles(manifest: Record<string, { file: string }>)
{
  const out = new Set<string>()
  Object.entries(manifest).forEach(([key, assets]) =>
  {
    out.add(assets.file)
  })
  return out
}

function getConfig(type: 'brotli' | 'gzip')
{
  if (type === 'brotli')
    return {
      params: {
        [constants.BROTLI_PARAM_QUALITY]:
            constants.BROTLI_MAX_QUALITY
      }
    }

  //if (type === 'gzip')
  return {
    level: constants.Z_BEST_COMPRESSION
  }
}

function getExtension(type: 'brotli' | 'gzip')
{
  if (type === 'brotli')
    return 'br'

  //if (type === 'gzip')
  return 'gz'
}

function getAlgorithm(type: 'brotli' | 'gzip')
{
  if (type === 'brotli')
    return brotli

  //if (type === 'gzip')
  return gzip
}

async function generate(
  original: { size: number, content: Buffer, path: ParsedPath },
  type: 'brotli' | 'gzip' , minRatio: number)
{
  const { dir, base } = original.path
  const algorithm = getAlgorithm(type)

  const contentCompressed = await algorithm(original.content, getConfig('gzip'))
  if (Buffer.byteLength(contentCompressed) / original.size <= minRatio)
  {
    await writeFile(join(dir, base + '.' + getExtension(type)), contentCompressed)
  }
}

(async () =>
{
  try
  {
    const build = await new Build(false).build()
    const manifest: Record<string, { file: string }> = JSON.parse(await readFile(new URL("../../dist-ssr/dist/manifest.json", import.meta.url), 'utf-8'))

    const files = getGeneratedFiles(manifest)
    await Promise.all([...files].map(async (filePath) =>
    {
      const fileUrl = new URL("../../dist-ssr/dist/" + filePath, import.meta.url)
      const path = parse(fileURLToPath(fileUrl))

      const content = await readFile(fileUrl)
      const size = Buffer.byteLength(content)
      if (size < 8192)
        return

      await generate({ size, content, path }, 'brotli', 0.8)
      await generate({ size, content, path }, 'gzip', 0.8)
    }))
  }
  catch (e)
  {
    console.log(e)
  }
})()

