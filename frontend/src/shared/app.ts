import { createSSRApp, createApp } from 'vue'
import { createBundledRouter } from './router'

import { createI18n } from 'vue-i18n'
import { merge } from 'lodash-es'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import { createPinia } from 'pinia'

import app from '@components/App.vue'
import { createGraphql } from '@shared/graphql'
import { useStore } from '@shared/store'
import Globali18n from './Translations/i18nGlobal.json'

//import messages from '@intlify/unplugin-vue-i18n/messages'

import type { App, Component } from 'vue'
import type { Router } from 'vue-router'
import type { Pinia, Store, StateTree } from 'pinia'
import type { ApolloClients } from '@vue/apollo-ssr'
import type { I18n } from 'vue-i18n'

import type { State } from '@shared/store'

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, StateTree>
  }
}

type BundleArgs = { ctx?: Partial<State>, networkToken?: string }

function createBundledApp(root: Component, args: BundleArgs = {})
{
  const app = (import.meta.env.SSR || __IS_SSR__) ? createSSRApp(root) : createApp(root)
  const { router, localization } = createBundledRouter()

  const GraphqlVue = createGraphql(args.networkToken)
  const pinia = createPinia()

  if (!import.meta.env.SSR && __IS_SSR__ && window.__INITIAL_STATE__)
  {
    pinia.state.value = window.__INITIAL_STATE__

    Array.from(window!.document!.getElementsByTagName('script'))!.find((val)=>
    {
      return val.text.startsWith("window.__INITIAL_STATE__")
    })!.remove()
  }

  app.use(router)
  app.use(pinia)

  const store = useStore(pinia)
  if (import.meta.env.SSR && args.ctx)
    store.$patch(args.ctx)

  const i18n = createI18n(
    {
      availableLocales: ['en', 'de'],
      legacy: false,
      locale: store.language,
      fallbackLocale: ['en', 'de'],
      messages: merge(localization, Globali18n)
    })

  app.use(i18n)
  app.use(GraphqlVue)
  app.use(createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    }
  }))

  app.component('font-awesome-icon', FontAwesomeIcon)

  const out: BundledApp<typeof store, typeof i18n> = {
    app,
    router,
    pinia,
    store,
    i18n,
    apolloClients: GraphqlVue.clients
  }
  return out
}

export interface BundledApp<S extends Store<any>, P extends I18n<any>> {
  app: App<Element>;
  router: Router;
  pinia: Pinia,
  store: S
  i18n: P;
  apolloClients: ApolloClients
}

function createDefaultApp(args: BundleArgs = {})
{
  return createBundledApp(app, args)
}

export { createBundledApp, createDefaultApp }