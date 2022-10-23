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
      portrait: { data: { attributes: { url: string, width: number, height: number }}}
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

export {
  Faecher,
  Lehramt,
  Grad,
  Feld,
  Rolle,
  VertreterGQL
}