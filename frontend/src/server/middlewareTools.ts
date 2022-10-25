import { Netmask } from 'netmask'
import crypto from 'crypto'

import type { Request, Response, NextFunction } from 'express'


const uniMask = new Netmask("132.180.0.1/16")
const fsLanMask = new Netmask("172.16.0.1/16")

export const uniNet = (req: Request, res: Response, next: NextFunction) =>
{
  const ip = req.headers["x-real-ip"]

  if (typeof ip === "string")
    res.locals.isUni = uniMask.contains(ip) || fsLanMask.contains(ip)
  else
    res.locals.isUni = false
  next()
}

export const cspNonce = (req: Request, res: Response, next: NextFunction) =>
{
  res.locals.cspNonce = crypto.randomBytes(40).toString('base64url').substring(0, 40)
  next()
}