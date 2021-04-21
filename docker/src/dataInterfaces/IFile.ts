import type { ObjectId } from "mongoose";

export interface IFile {

    _id: ObjectId;
    length: number
    uploadDate: Date
    filename: string
    md5: string
    contentType: string
}