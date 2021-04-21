import { createDefaultApp } from '@shared/app'
import type { State } from '@shared/store'

const instance = createDefaultApp();

declare global {
    interface Window {
        __INITIAL_STATE__?: State
    }
}

if (window.__INITIAL_STATE__) {
    instance.store.replaceState(window.__INITIAL_STATE__);

    const scripts = window.document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; ++i) {
        const script = scripts[i];
        if (script.text.startsWith("window.__INITIAL_STATE__")) {
            script.remove();
            break;
        }
    }
}

instance.router.isReady().then(() => {
    instance.app.mount('#app', true);
})
