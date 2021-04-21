import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'

const initialState = {
    defaultFavicon: require('@static/favicon.svg'),
    defaultTitle: "FSMPI",
    language: "",
}

export type State = typeof initialState;

export const key: InjectionKey<Store<State>> = Symbol();

export function createDefaultStore() {
    return createStore<State>({
        strict: __IS_DEV__,
        state: initialState,
        mutations: {
            setLanguage(state, lang: string) {
                state.language = lang;
            },
        },
    })
}

export function useStore() {
    return baseUseStore(key);
}
export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;