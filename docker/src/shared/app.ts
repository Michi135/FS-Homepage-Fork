import { createSSRApp, Component, createApp } from 'vue'
import { createBundledRouter } from './router'
import { App } from '@vue/runtime-core'
import { Router } from 'vue-router'
import app from '@components/App.vue'
import { createDefaultStore, key, State } from './store'
import type { Store } from 'vuex'
import { createI18n, I18n } from 'vue-i18n'
import _ from 'lodash'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import { createGraphql } from './graphql'
import Globali18n from './i18nGlobal.json'
import type { ApolloClients } from '@vue/apollo-ssr'

function createBundledApp(root: Component, ctx: Partial<State>)
{
  const app = (__IS_SERVER__ || __IS_SSR__) ? createSSRApp(root) : createApp(root)
  const { router, localizedRoutes } = createBundledRouter()
  const store = createDefaultStore(router, ctx)

  const i18n = createI18n(
    {
      availableLocales: ['en', 'de'],
      legacy: false,
      locale: store.state.language,
      fallbackLocale: ['en', 'de'],
      messages: _.merge(localizedRoutes, Globali18n)
    })
  const GraphqlVue = createGraphql()

  app.use(router)
  app.use(store, key)
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

  //app.component('font-awesome-icon', FontAwesomeIcon)

  const out: BundledApp<typeof store, typeof i18n> = {
    app: app,
    router: router,
    store: store,
    i18n,
    apolloClients: GraphqlVue.clients
  }
  return out
}

export interface BundledApp<S extends Store<any>, P extends I18n<any>> {
    app: App<Element>;
    router: Router;
    store: S;
    i18n: P;
    apolloClients: ApolloClients
}

function createDefaultApp(ctx: Partial<State>)
{
  return createBundledApp(app, ctx)
}

export { createBundledApp, createDefaultApp }