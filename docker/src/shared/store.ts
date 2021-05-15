import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import type { Router } from 'vue-router';

const initialState = (router: Router) => {
    return {
        defaultFavicon: require('@static/favicon.svg'),
        defaultTitle: "FSMPI",
        language: "",
    }
}

export type State = ReturnType<typeof initialState>;

export const key: InjectionKey<Store<State>> = Symbol();

export function createDefaultStore(router: Router) {
    return createStore<State>({
        strict: __IS_DEV__,
        state: initialState(router),
        mutations: {
            setLanguage(state, lang: string) {
                state.language = lang;
            },
        },
        getters: {
            route(state) {
                return router.currentRoute.value
            }
        },
    })
}

export function useStore() {
    return baseUseStore(key);
}
export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;