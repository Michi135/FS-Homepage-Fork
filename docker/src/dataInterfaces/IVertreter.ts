import type { Ref } from "@typegoose/typegoose"
import type { IFile } from '@dataInterfaces/IFile'

export interface IStudiengang {
    lectureShip?: 'GYMNASIUM',
    degree: 'BACHELOR' | 'MASTER',
    field?: 'SCIENCE',
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

/*export interface IResolvedVertreter extends Partial<IVertreter> {

    image: Partial<IFile>
}*/

export interface IResolvedVertreter {
    nutzer_email: {
      name: string
      email: string
    },
    rolle: string,
    grad: string,
    feld: string,
    hauptfach: string,
    zweitfach:  string | undefined,
    Lehramt: string | undefined,
    semester: number,
    portrait: { url: string }
  }