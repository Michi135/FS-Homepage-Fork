/**
 * einstellungen router.
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::einstellungen.einstellungen');

/*, {
    config: {
        find: {
            middlewares: [
                (ctx, next) => {
                    console.log('Hello')
                    console.log(ctx)
                    return next()
                }
            ]
        }
    }
}*/