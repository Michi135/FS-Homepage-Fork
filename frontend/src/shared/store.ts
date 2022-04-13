import { defineStore } from 'pinia'
import defFav from '@static/favicon.svg'

const defaultState: {
  defaultFavicon: any
  defaultTitle: string
  language: 'de' | 'en'
  initialTime: Date
  isUniNetwork: boolean
} = {
  defaultFavicon: defFav,
  defaultTitle: "FSMPI",
  language: "de",
  initialTime: new Date(),
  isUniNetwork: false
  //x2: ""
}

export type State = typeof defaultState;

//export const key: InjectionKey<Store<State>> = Symbol()


export const useStore = defineStore('main', {
  state: () => defaultState,
  actions: {
    setLanguage(lang: 'de' | 'en')
    {
      this.language = lang
    }
  },
  getters: {
    /*route(state)
    {
      return router.currentRoute.value
    }*/
  }
})

//export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;