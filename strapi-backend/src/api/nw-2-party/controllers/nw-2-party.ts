/**
 * nw-2-party controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::nw-2-party.nw-2-party', ({strapi}) => ({
    /*async create(ctx) {

        const res = await super.create(ctx)
        console.log("Context-----")
        console.log(ctx)
        console.log("Response-----")
        console.log(res)
        console.log("End--------")

        return res
    
    },
    async update(ctx) {
        // some logic here
        const response = await super.update(ctx);
        // some more logic
        console.log("Context-----")
        console.log(ctx)
        console.log("Response-----")
        console.log(response)
        console.log("End--------")

        return response;
      }*/
}));
