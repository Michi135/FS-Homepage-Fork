//import 'vite/modulepreload-polyfill'
import { createSSRApp, createApp } from 'vue'
import { createBundledRouter } from './router.js'

import { useI18n } from 'vue-i18n'
//@ts-ignore
import { createVuetify } from 'vuetify'
//@ts-ignore
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
//@ts-ignore
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import { createPinia } from 'pinia'

import app from '@components/App.vue'
import { createGraphql } from '@shared/graphql.js'
import { useStore } from '@shared/store.js'
import { createI18n } from '@shared/i18n.js'
import { createTagManager } from '@shared/tags/registration.js'

//import messages from '@intlify/unplugin-vue-i18n/messages'

import type { App, Component } from 'vue'
import type { Router } from 'vue-router'
import type { Pinia, Store, StateTree } from 'pinia'
import type { ApolloClients } from '@vue/apollo-ssr'
import type { I18n } from 'vue-i18n'

import type { State } from '@shared/store.js'

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, StateTree>
  }
}

import dayjs from 'dayjs'
//@ts-ignore
import utc from 'dayjs/plugin/utc'
//@ts-ignore
import timezone from 'dayjs/plugin/timezone'
//import customParseFormat from 'dayjs/plugin/customParseFormat'

export type BundleArgs = { storeState?: Partial<State>, networkToken?: string, locale?: SupportedLanguages }

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
  if (import.meta.env.SSR && args.storeState)
    store.$patch(args.storeState)


  const i18n = createI18n(args.locale, localization)
  const tagManager = createTagManager(store.nonce)

  app.use(i18n)
  app.use(GraphqlVue)
  app.use(createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n })
    },
    ssr: true
  }))
  app.use(tagManager)

  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault("Europe/Berlin")

  const out: BundledApp<typeof store, typeof i18n> = {
    app,
    router,
    pinia,
    store,
    i18n,
    tagManager,
    apolloClients: GraphqlVue.clients
  }
  return out
}

export interface BundledApp<S extends Store<any>, P extends I18n<any>> {
  app: App<Element>
  router: Router
  pinia: Pinia
  store: S
  i18n: P
  tagManager: ReturnType<typeof createTagManager>
  apolloClients: ApolloClients
}

function createDefaultApp(args: BundleArgs = {})
{
  return createBundledApp(app, args)
}

export { createBundledApp, createDefaultApp }