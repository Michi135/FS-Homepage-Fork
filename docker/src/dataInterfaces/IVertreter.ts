//import type { Ref } from "@typegoose/typegoose"
//import type { IFile } from '@dataInterfaces/IFile'

/*export interface IStudiengang {
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
}*/

/*export interface IResolvedVertreter extends Partial<IVertreter> {

    image: Partial<IFile>
}*/

type Faecher = 'COMPUTER SCIENCE' | 'PHYSICS' | 'MATH' | 'TECHNO MATH'
type Lehramt = 'GYMNASIUM'
type Grad = 'BACHELOR' | 'MASTER'
type Feld = 'SCIENCE'
type Rolle = "HEAD" | "VICE" | "FINANCES" | "NETWORKING" | "UNI-CINEMA" | "PUBLIC RELATIONS" | "BEER COORDINATION" | "PHYSICIST BAR" | "GRAPHICS" | "SCRIPTS" | "ROOT"


interface VertreterGQL {
    nutzer_email: {
        name: string
        email: string
    },
    rolle: Rolle,
    grad: Grad,
    feld: Feld,
    hauptfach: Faecher,
    zweitfach?: Faecher,
    Lehramt?: Lehramt,
    semester: number,
    portrait: { url: string }
}

export {
  Faecher,
  Lehramt,
  Grad,
  Feld,
  Rolle,
  VertreterGQL
}