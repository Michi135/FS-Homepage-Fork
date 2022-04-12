
import { createHash } from "crypto";
import busboy from "busboy";
import { S3Client, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime-types";
import { PassThrough, Readable } from "stream";

import type { NextFunction, Request, Response } from 'express'


const S3_BUCKET = process.env.S3_BUCKET;
const S3_REGION = process.env.S3_REGION;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

const fileChecksum = (file: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = createHash("sha256").setEncoding("hex");
    file
      .once("error", (err) => reject(err))
      .on("data", (chunk) => hash.update(chunk))
      .once("end", () => resolve(hash.digest("hex")));
  });

async function endPoint(req: Request, res: Response) {
    const bb = busboy({ headers: req.headers });

    bb.on("file", async (_name, file, info) => {
        const ext = mime.extension(info.mimeType);
        const hashStream = new PassThrough();
        const intermediateStream = new PassThrough();
        const fileStream = new PassThrough();

        intermediateStream
        .on("data", (chunk) => fileStream.write(chunk))
        .once("end", () => fileStream.end());

        file.pipe(hashStream).pipe(intermediateStream);

        const hash = await fileChecksum(hashStream);

        const filename = `${hash}.${ext}`;

        const params: PutObjectCommandInput = {
            Bucket: S3_BUCKET ?? "",
            Key: filename,
            Body: fileStream,
            ContentType: info.mimeType,
            ContentEncoding: info.encoding,
            Metadata: {
                filename: info.filename,
            },
        };

        const client = new S3Client({
            endpoint: S3_ENDPOINT ?? "",
            region: S3_REGION ?? "",
            credentials: {
                accessKeyId: S3_ACCESS_KEY_ID ?? "",
                secretAccessKey: S3_SECRET_ACCESS_KEY ?? "",
            },
        });

        const upload = new Upload({
            client,
            params,
        });

        await upload.done();

        res.json({ hash, filename, error: null });
    });
    req.pipe(bb);
}

export default endPoint;