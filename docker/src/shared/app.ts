import { createSSRApp, Component, createApp } from 'vue'
import { createBundledRouter } from './router'
import { App } from '@vue/runtime-core'
import { Router } from 'vue-router'
import app from '@components/App.vue'
import { createDefaultStore, key, State } from './store'
import { Store } from 'vuex'
import { createI18n, I18n } from 'vue-i18n'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createVuetify } from 'vuetify'
//@ts-ignore
//const { components } = require("vuetify")
//const {VListGroup} = require('vuetify/components')

//import * as components from 'vuetify/lib/components'

function createBundledApp(root: Component, ctx: Partial<State>) {
    const app = (__IS_SERVER__ || (!__IS_DEV__ && __IS_SSR__)) ? createSSRApp(root) : createApp(root);
    const { router, localizedRoutes } = createBundledRouter()
    const store = createDefaultStore(router, ctx);

    const i18n = createI18n(
        {
            availableLocales: ['en', 'de'],
            legacy: false,
            locale: store.state.language,
            fallbackLocale: ['en', 'de'],
            messages: _.merge(localizedRoutes, 
                {
                    de: 
                    {
                        studentCouncil: "Fachschaft | Fachschaften",
                        math: "Mathe",
                        physics: "Physik",
                        computerScience: "Informatik",
                        mail: "Email",
                        phone: "Telefon",
                        contact: "Kontakt",
                        name: "Name",
                        role: "Rolle",
                        here: "Hier",
                        monday: "Montag",
                        tuesday: "Dienstag",
                        wednesday: "Mittwoch",
                        thursday: "Donnerstag",
                        friday: "Freitag",
                        link: "Link",
                    },
                    en:
                    {
                        studentCouncil: "Student council | Student councils",
                        math: "Math",
                        physics: "Physics",
                        computerScience: "Computer science",
                        mail: "Mail",
                        phone: "Phone",
                        contact: "Contact",
                        name: "Name",
                        role: "Role",
                        here: "Here",
                        monday: "Monday",
                        tuesday: "Tuesday",
                        wednesday: "Wednesday",
                        thursday: "Thursday",
                        friday: "Friday",
                        link: "Link",
                    }
                })
        });

    app.use(router);
    app.use(store, key);
    app.use(i18n);
    app.use(createVuetify(/*{components: components}*/));

    app.component('font-awesome-icon', FontAwesomeIcon)

    const out: BundledApp<typeof store, typeof i18n> = {
        app: app,
        router: router,
        store: store,
        i18n
    };
    return out;
}

export interface BundledApp<S extends Store<any>, P extends I18n<any>> {
    app: App<Element>;
    router: Router;
    store: S;
    i18n: P;
}

function createDefaultApp(ctx: Partial<State>) {
    return createBundledApp(app, ctx);
}

export { createBundledApp, createDefaultApp };