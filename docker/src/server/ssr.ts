import { createDefaultContext } from '../shared/context'
import { renderToString, SSRContext } from '@vue/server-renderer'
import { getStyles } from './cdn.config'
import { getMeta } from './meta.config'
import { RouteLocationNormalized } from 'vue-router'
import { createFaviconLink } from '../favicon/favicon'
import { NextFunction, Request, Response } from 'express'
import { Stats, Compiler } from 'webpack'
import { JSDOM } from 'jsdom'
import { join } from 'path'
import type * as App from '../shared/app'

const supportedLanguages =
    ['de',
        'en']

function getLanguage(req: Request) {

    const lang = req.acceptsLanguages(supportedLanguages)
    return lang ? lang : 'en'
}

function loadFavicon(route: RouteLocationNormalized, context: SSRContext) {
    const favicon = (route.meta.favicon) ? route.meta.favicon : context.state.defaultFavicon;

    return createFaviconLink(favicon);
}

function loadDevMiddleWare(res: Response) {
    interface devMiddleware {
        stats: Stats,
        outputFileSystem: Compiler['outputFileSystem']
    };
    const devMiddleware = res.locals?.webpack?.devMiddleware;

    return (!!devMiddleware) ? <devMiddleware>devMiddleware : undefined;
}

function loadTitle(route: RouteLocationNormalized, context: SSRContext) {
    return (route.meta.title) ? route.meta.title : context.state.defaultTitle;
}

export default function ssr(dev: boolean) {

    return async function (req: Request, res: Response, next: NextFunction) {
        if (!req.accepts('html') || req.method !== 'GET')
            return next();

        try {
            const devMiddleware = loadDevMiddleWare(res);

            const outputFileSystem = devMiddleware?.outputFileSystem;
            const jsonWebpackStats = devMiddleware?.stats.toJson();
            const { assetsByChunkName, outputPath } = jsonWebpackStats || {};

            if (dev) delete require.cache[require.resolve('@distServer/main')];

            const { createDefaultApp } = <typeof App>require('@distServer/main');
            const { router, store, app } = createDefaultApp();

            router.push(req.url);
            await router.isReady();

            const currentRoute = router.currentRoute.value;
            if (!currentRoute.matched.length) return res.status(404).end();

            const language = getLanguage(req);
            let context = await createDefaultContext();

            store.commit('setLanguage', language);

            context.state = store.state;

            res.contentType('html');
            res.charset = 'utf-8';

            const dom = (!devMiddleware)
                ? await JSDOM.fromFile('./dist-ssr/dist/test.html')
                : new JSDOM(await new Promise<string>((resolve, reject) => {
                    outputFileSystem!.readFile(join(outputPath!, 'test.html'), (error, result) => {
                        if (error)
                            reject(error);
                        resolve(result! as string);
                    })
                }));

            const doc = dom.window.document;
            const head = doc.head;
            doc.children[0].setAttribute('lang', language);
            //doc.lang
            head.innerHTML += `<title>${loadTitle(currentRoute, context)}</title>`;
            head.innerHTML += `<link href="https://cdnjs.cloudflare.com" rel="preconnect" crossorigin>`
            head.innerHTML += getMeta();
            head.innerHTML += getStyles();
            head.innerHTML += loadFavicon(currentRoute, context);
            head.innerHTML += `<script>window.__INITIAL_STATE__=${JSON.stringify(context.state)}</script>`
            doc.getElementById('app')!.innerHTML = await renderToString(app, context);

            res.send(dom.serialize()).end();

        } catch (error) {
            console.log(error);
            return res.status(500).end("Internal Server Error");
        }
    };
}