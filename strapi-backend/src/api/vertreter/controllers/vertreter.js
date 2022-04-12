'use strict';

/**
 *  vertreter controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vertreter.vertreter'/*, {
    async find(ctx) {
        console.log('YES')

        const { data, meta } = await super.find(ctx);

        return { data, meta }
    }
}*/);
