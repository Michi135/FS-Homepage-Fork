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

//type Faecher = 'COMPUTER SCIENCE' | 'PHYSICS' | 'MATH' | 'TECHNO MATH'
//type Lehramt = 'GYMNASIUM'
//type Grad = 'BACHELOR' | 'MASTER'
//type Feld = 'SCIENCE'
//type Rolle = "HEAD" | "VICE" | "FINANCES" | "NETWORKING" | "UNI-CINEMA" | "PUBLIC RELATIONS" | "BEER COORDINATION" | "PHYSICIST BAR" | "GRAPHICS" | "SCRIPTS" | "ROOT"

type Faecher = 'Informatik' | 'Physik' | 'Mathe' | 'Technomathe'
type Lehramt = 'Gymnasium'
type Grad = 'Bachelor' | 'Master'
type Feld = 'Science'
type Rolle = "Chef" | "Vize" | "Finanzen" | "Networking" | "Uni_Kino" | "Oeffentlichkeitsarbeit" | "Bierkoordination" | "Physiker" | "Grafiken" | "Skripten" | "Root"


type VertreterGQL = {
    data: [{
        attributes: {
            anzeigeName: string
            grad: Grad
            feld: Feld
            semester: number
            portrait: { data: { attributes: { url: string }}}
            hauptfach: { fach: Faecher }
            lehramt?: {
                zweitfach: { fach: Faecher }
                schultyp: Lehramt
            }
            position: Rolle
            email: string
        }
    }]
}



/*interface VertreterGQL {
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
}*/

export {
  Faecher,
  Lehramt,
  Grad,
  Feld,
  Rolle,
  VertreterGQL
}