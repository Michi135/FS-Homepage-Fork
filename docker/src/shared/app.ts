import { createSSRApp, Component, createApp } from 'vue'
import { createBundledRouter } from './router'
import { App } from '@vue/runtime-core'
import { Router } from 'vue-router'
import app from '@components/App.vue'
import { createDefaultStore, key } from './store'
import { Store } from 'vuex'

function createBundledApp(root: Component) {
    const app = (__IS_SERVER__ || (!__IS_DEV__ && __IS_SSR__)) ? createSSRApp(root) : createApp(root);
    const router = createBundledRouter()
    const store = createDefaultStore(router);
    app.use(router);
    app.use(store, key);

    const out: BundledApp<typeof store> = {
        app: app,
        router: router,
        store: store,
    };
    return out;
}

export interface BundledApp<S extends Store<any>> {
    app: App<Element>;
    router: Router;
    store: S;
}

function createDefaultApp() {
    return createBundledApp(app);
}

export { createBundledApp, createDefaultApp };