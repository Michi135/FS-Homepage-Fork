import { join } from "path"
import mime from "mime"
import fsExtra from "fs-extra"

const { getType } = mime
const { pathExists } = fsExtra

import type { Request, Response } from 'express'

export function fileRequest(basePath: string)
{
  return async (req: Request, res: Response) =>
  {
    const distPath = join(basePath, req.url)

    try
    {
      if (await pathExists(distPath))
      {

        let encoding = req.acceptsEncodings(['br'])
        if (!encoding) encoding = req.acceptsEncodings(['gzip'])
        if (encoding)
        {
          let extension: string = ''
          if (encoding === 'gzip')
            extension = 'gz'
          else if (encoding === 'br')
            extension = 'br'

          const distPathEncoded = distPath.concat('.', extension)
          if (await pathExists(distPathEncoded))
          {
            const contentType = getType(distPath)
            res.setHeader('Content-Encoding', encoding)
            res.status(200).contentType(contentType!).sendFile(distPathEncoded)
            return
          }
        }
        return res.status(200).sendFile(distPath)
      }
      else
      {
        return res.status(404).end()
      }
    }
    catch (error)
    {
      console.log(error)
      return res.status(500).end()
    }
  }
};