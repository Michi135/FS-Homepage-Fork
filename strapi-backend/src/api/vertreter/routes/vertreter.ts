/**
 * vertreter router.
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::vertreter.vertreter');

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