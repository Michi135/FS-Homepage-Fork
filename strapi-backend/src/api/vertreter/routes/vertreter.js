'use strict';

/**
 * vertreter router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::vertreter.vertreter'/*, {
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
