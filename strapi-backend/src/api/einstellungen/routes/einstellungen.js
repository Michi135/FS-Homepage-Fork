'use strict';

/**
 * einstellungen router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::einstellungen.einstellungen'/*, {
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
}*/);
