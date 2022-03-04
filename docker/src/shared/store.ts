import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import type { Router } from 'vue-router'
import defFav from '@static/favicon.svg'


const defaultState = {
  defaultFavicon: defFav,
  defaultTitle: "FSMPI",
  language: "de"
}

const initialState = (router: Router, ctx: Partial<State>): State =>
{
  return {
    defaultFavicon: defaultState.defaultFavicon,
    defaultTitle: ctx.defaultTitle || defaultState.defaultTitle,
    language: ctx.language || defaultState.language
  }
}

export type State = typeof defaultState;

export const key: InjectionKey<Store<State>> = Symbol()

export function createDefaultStore(router: Router, ctx: Partial<State>)
{
  return createStore<State>({
    strict: __IS_DEV__,
    state: initialState(router, ctx),
    mutations: {
      setLanguage(state, lang: string)
      {
        state.language = lang
      }
    },
    getters: {
      route(state)
      {
        return router.currentRoute.value
      }
    }
  })
}

export function useStore()
{
  return baseUseStore(key)
}
export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;