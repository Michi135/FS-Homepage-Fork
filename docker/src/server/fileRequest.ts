import { pathExists } from "fs-extra";
import { join } from "path";

import type { Request, Response } from 'express'
import { getType } from "mime";

export function fileRequest(basePath: string) {

    return async (req: Request, res: Response) => {
        const distPath = join(basePath, req.url);

        try {
            if (await pathExists(distPath)) {

                let encoding = req.acceptsEncodings(['br']);
                if (!encoding) encoding = req.acceptsEncodings(['gzip']);
                if (encoding) {
                    let extension: string = '';
                    if (encoding === 'gzip')
                        extension = 'gz';
                    else if (encoding === 'br')
                        extension = 'br'

                    const distPathEncoded = distPath.concat('.', extension);
                    if (await pathExists(distPathEncoded)) {
                        //const contentType = e.static.mime.getType(distPath);
                        const contentType = getType(distPath);
                        res.setHeader('Content-Encoding', encoding);
                        res.status(200).contentType(contentType!).sendFile(distPathEncoded);
                        return;
                    }
                }
                return res.status(200).sendFile(distPath);
            }
            else {
                return res.status(404).end();
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
    }
};