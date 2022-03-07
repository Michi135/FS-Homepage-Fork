import { defineStore } from 'pinia'
import defFav from '@static/favicon.svg'

const defaultState = {
  defaultFavicon: defFav,
  defaultTitle: "FSMPI",
  language: "de",
  initialTime: new Date()
}

export type State = typeof defaultState;

//export const key: InjectionKey<Store<State>> = Symbol()


export const useStore = defineStore('main', {
  state: () => defaultState,
  actions: {
    setLanguage(lang: string)
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