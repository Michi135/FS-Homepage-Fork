/**
 *  vertreter controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::vertreter.vertreter');
/*, {
    async find(ctx) {
        console.log('YES')

        const { data, meta } = await super.find(ctx);

        return { data, meta }
    }
}*/