import type { Ref } from "@typegoose/typegoose";
import type { IFile } from '@dataInterfaces/IFile'

export interface IStudiengang {
    lectureShip?: 'gymnasium',
    degree: 'bachelor' | 'master',
    field?: 'science',
    course: string,
    secondary?: string
}

export interface IVertreter {

    imageRef: Ref<IFile>
    name: string
    role: string
    studiengang: IStudiengang
    semester: number
    email: string
}

export interface IResolvedVertreter extends Partial<IVertreter> {

    image: Partial<IFile>
}