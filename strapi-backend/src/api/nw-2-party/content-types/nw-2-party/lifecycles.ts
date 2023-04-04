import type { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils"
import crypto from 'crypto'
const { file: { bytesToKbytes }, nameToSlug } = utils
const { ValidationError } = utils.errors
import { Readable } from "stream";
import path from 'path'
import fs from 'fs'
import fsP from 'fs/promises'
import sharp from 'sharp'
import fetch from 'node-fetch'
/*
strapi.db.lifecycles.subscribe({
    //@ts-ignore
    models: ['plugin::upload.file'],

    beforeCreate(event)
    {
        const { data, where, select, populate } = event.params;

        console.log("aha")
    },
    beforeUpdate(event)
    {
        console.log(event)
    }
})*/

interface Aspects 
{
    width: number
    height: number
}

function validImage(aspects: Aspects, ratio?: Aspects)
{
    if (aspects.width < 720)
        return false

    if (!ratio)
        return true

    return Math.floor(aspects.width / ratio.width) === Math.floor(aspects.height / ratio.height)
}

const AbsRgExp = new RegExp('^(?:[a-z]+:)?//', 'i');

interface FileInfo
{
    folder: string
    caption: string
    alternativeText: string
    //size: number
}

interface Misc
{
    folderPath: string
    ext: string
    name: string
    mime: string
}

const randomSuffix = () => crypto.randomBytes(5).toString('hex');

const generateFileName = (name) => {
    const baseName = nameToSlug(name, { separator: '_', lowercase: false });
  
    return `${baseName}_${randomSuffix()}`;
  };

  /*
async function uploadFirst(arrayBuffer: ArrayBuffer, fileInfo: FileInfo, misc: Misc, metas)
{
    const { ext, name, mime, size, folderPath } = misc
    const basename = path.basename(name, ext);

    const entity = {
      name,
      alternativeText: fileInfo.alternativeText,
      caption: fileInfo.caption,
      folder: fileInfo.folder,
      folderPath,
      hash: generateFileName(basename),
      ext,
      mime,
      size: bytesToKbytes(size),
      provider: strapi.config.get("plugin.upload").provider
    };

    const { refId, ref, field } = metas;

    if (refId && ref && field) {
        //@ts-ignore
      entity.related = [
        {
          id: `${refId}`,
          __type: ref,
          __pivot: { field },
        },
      ];
    }

    const newBuffer = await sharp(Buffer.from(arrayBuffer)).resize(200, 200, {fit: 'fill'}).toBuffer()

    //@ts-ignore
    entity.getStream = () => Readable.from(newBuffer)

    //persists file
    await strapi.plugin('upload').service('provider').upload(entity)

    //creates file link in db
    return strapi
        .query('plugin::upload.file')
        .create({ data: entity });
}
*/
async function upload(buffer: Buffer, fileInfo: FileInfo, misc: Misc, metas, size: Aspects)
{
    const { ext, name, mime, folderPath } = misc
    const basename = path.basename(name, ext);

    const entity = {
      name,
      ...size,
      alternativeText: fileInfo.alternativeText,
      caption: fileInfo.caption,
      folder: fileInfo.folder,
      folderPath,
      hash: generateFileName(basename),
      ext,
      mime,
      size: bytesToKbytes(buffer.byteLength),
      provider: strapi.config.get("plugin.upload").provider
    };

    const { refId, ref, field } = metas;

    if (refId && ref && field) {
        //@ts-ignore
      entity.related = [
        {
          id: `${refId}`,
          __type: ref,
          __pivot: { field },
        },
      ];
    }

    //@ts-ignore
    entity.getStream = () => Readable.from(buffer)

    //persists file
    await strapi.plugin('upload').service('provider').upload(entity)

    //creates file link in db
    return strapi
        .query('plugin::upload.file')
        .create({ data: entity });
}

async function loadImage(url: string): Promise<ArrayBuffer>
{
    //const q = (AbsRgExp.test(url)) ? url : new URL(url, strapi.config.get('server.url'))
    
    if (AbsRgExp.test(url))
    {
        const file = await fetch(url)
        if(!file.ok)
            throw new ValidationError("Could not load image for post-processing")
        return await file.arrayBuffer()
    }
    //assume local
    else
    {
        const filePath = path.join(strapi.dirs.static.public, url)
        if (!fs.existsSync(filePath))
            throw new ValidationError("Could not load image for post-processing")

        return (await fsP.readFile(filePath)).buffer
    }    
}

const plakate = 
{
    "Plakat": null,
    "Plakat1x1": 
    {
        width: 1,
        height: 1
    },
    "Plakat4x3":
    {
        width: 4,
        height: 3
    },
    "Plakat16x9":
    {
        width: 16,
        height: 9
    }
}

export default
{
    //TODO:: also do this with updates
    //Maybe hook if picture gets deleted from media library
    async beforeCreate(event) {
        const { data } = event.params;
        const { state } = event
    
        for (const [key, value] of Object.entries(plakate)) 
        {
            if (!data[key])
                continue

            //console.log(data[key])
            const plakat = await strapi.entityService.findOne('plugin::upload.file', data[key])
            const { width, height, url } = plakat

            let invalid = false

            if (key === 'Plakat')
            {
                invalid = !validImage({ width, height }) || !data.Plakat4x3 || !data.Plakat16x9 || !data.Plakat1x1
                /*invalid = Object.keys(plakate).every(k => 
                    {
                        if (k === 'Plakat')
                            return !validImage({ width, height })
                        else
                            return !data[k]
                    })*/
            }
            else if (data[key])
                invalid = !validImage({ width, height }, value)
    
            if (invalid)
            {
                state[key] = {}
                state[key].file = await loadImage(url)
                state[key].plakatInfo = plakat
            }
        }
    },
    
    async afterCreate({ state, result, params }) 
    {
        for (const [key, ratio] of Object.entries(plakate)) 
        {
            if (!state[key])
                continue

            const { file, plakatInfo } = state[key]
            const { name, width, height, alternativeText, caption, ext, mime, folderPath } = plakatInfo

            if (key === 'Plakat')
            {
                const folder = await strapi.db.query('plugin::upload.folder').findOne({ where: { files: { id: plakatInfo.id } }, populate: ['pathId']})
                const info: FileInfo = { folder, caption, alternativeText }

                if (!validImage({ width, height })) //maybe invalid, could be just for aspect creations
                {
                    const newSize = { width: 720, height: Math.floor(720 * (height / width))}
                    const newBuffer = await sharp(Buffer.from(file)).resize(newSize.width, newSize.height).toBuffer()

                    await upload(newBuffer, info, { ext, name, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, newSize)
                }
                //TODO:: check all other and maybe create aspect images
                const subWidth = Math.max(720, width)

                await Promise.all(Object.entries(plakate).map(async val => 
                    {
                        const key = val[0]
                        if (key === 'Plakat' || result[key])
                            return
                        
                        const ratio = val[1]

                        const subSize = { width: subWidth, height: Math.floor(subWidth * (ratio.height / ratio.width))}
                        const newBuffer = await sharp(Buffer.from(file)).resize(subSize.width, subSize.height, { fit: 'fill' }).toBuffer()

                        const subName = path.basename(name, ext) + `_${ratio.width}x${ratio.height}` + ext

                        await upload(newBuffer, info, { ext, name: subName, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, subSize)
                    }))
            }
            else
            {
                const folder = await strapi.db.query('plugin::upload.folder').findOne({ where: { files: { id: plakatInfo.id } }, populate: ['pathId']})
                const info: FileInfo = { folder, caption, alternativeText }

                const newWidth = Math.max(720, width)            
                const newSize = { width: newWidth, height: Math.floor(newWidth * (ratio.height / ratio.width))}
                const newBuffer = await sharp(Buffer.from(file)).resize(newSize.width, newSize.height, { fit: 'fill' }).toBuffer()

                await upload(newBuffer, info, { ext, name, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, newSize)
            }
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;
        const { state } = event
    
        for (const [key, value] of Object.entries(plakate)) 
        {
            if (!data[key])
                continue

            //console.log(data[key])
            const plakat = await strapi.entityService.findOne('plugin::upload.file', data[key])
            const { width, height, url } = plakat

            let invalid = false

            if (key === 'Plakat')
            {
                invalid = !validImage({ width, height }) || !data.Plakat4x3 || !data.Plakat16x9 || !data.Plakat1x1
                /*invalid = Object.keys(plakate).every(k => 
                    {
                        if (k === 'Plakat')
                            return !validImage({ width, height })
                        else
                            return !data[k]
                    })*/
            }
            else if (data[key])
                invalid = !validImage({ width, height }, value)
    
            if (invalid)
            {
                state[key] = {}
                state[key].file = await loadImage(url)
                state[key].plakatInfo = plakat
            }
        }
    },

    async afterUpdate({ state, result, params }) 
    {
        for (const [key, ratio] of Object.entries(plakate)) 
        {
            if (!state[key])
                continue

            const { file, plakatInfo } = state[key]
            const { name, width, height, alternativeText, caption, ext, mime, folderPath } = plakatInfo

            if (key === 'Plakat')
            {
                const folder = await strapi.db.query('plugin::upload.folder').findOne({ where: { files: { id: plakatInfo.id } }, populate: ['pathId']})
                const info: FileInfo = { folder, caption, alternativeText }

                if (!validImage({ width, height })) //maybe invalid, could be just for aspect creations
                {
                    const newSize = { width: 720, height: Math.floor(720 * (height / width))}
                    const newBuffer = await sharp(Buffer.from(file)).resize(newSize.width, newSize.height).toBuffer()

                    await upload(newBuffer, info, { ext, name, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, newSize)
                }
                //TODO:: check all other and maybe create aspect images
                const subWidth = Math.max(720, width)

                await Promise.all(Object.entries(plakate).map(async val => 
                    {
                        const key = val[0]
                        if (key === 'Plakat' || result[key])
                            return
                        
                        const ratio = val[1]

                        const subSize = { width: subWidth, height: Math.floor(subWidth * (ratio.height / ratio.width))}
                        const newBuffer = await sharp(Buffer.from(file)).resize(subSize.width, subSize.height, { fit: 'fill' }).toBuffer()

                        const subName = path.basename(name, ext) + `_${ratio.width}x${ratio.height}` + ext

                        await upload(newBuffer, info, { ext, name: subName, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, subSize)
                    }))
            }
            else
            {
                const folder = await strapi.db.query('plugin::upload.folder').findOne({ where: { files: { id: plakatInfo.id } }, populate: ['pathId']})
                const info: FileInfo = { folder, caption, alternativeText }

                const newWidth = Math.max(720, width)            
                const newSize = { width: newWidth, height: Math.floor(newWidth * (ratio.height / ratio.width))}
                const newBuffer = await sharp(Buffer.from(file)).resize(newSize.width, newSize.height, { fit: 'fill' }).toBuffer()

                await upload(newBuffer, info, { ext, name, mime, folderPath }, { refId: result.id, ref: "api::nw-2-party.nw-2-party", field: key }, newSize)
            }
        }
    },
}