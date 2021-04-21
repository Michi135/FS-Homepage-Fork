import type { Ref } from "@typegoose/typegoose";
import type { IFile } from '@dataInterfaces/IFile'

export interface IVertreter {

    imageRef: Ref<IFile>
    name: string
    role: string
    studiengang: string
    semester: number
    email: string
}

export interface IResolvedVertreter extends Partial<IVertreter> {

    image: Partial<IFile>
}