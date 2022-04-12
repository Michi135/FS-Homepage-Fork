'use strict';

const { ApolloError } = require('apollo-server-errors');

/*export class MyError extends ApolloError {

  constructor(message) {

    super(message, 'WRONG_NETWORK');
    Object.defineProperty(this, 'name', { value: '407' });

  }

}*/

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
   register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    extensionService.use({
      resolversConfig: {
        'Query.uniKinoFilmes': {
          policies: [
            (context, { strapi }) => {
              //context.http.throw(407, 'Nicht im Uni-Netz')
              //console.log(context)
              //console.log(strapi)
              console.log(context.http.request)

              if (context.http.request.header['x-real-ip'] !== '192.168.178.32')
                throw new ApolloError('activate uni vpn', 'WRONG_NETWORK')

              return true;
            }
          ],
          auth: false
          /*middlewares: [
            async (next, parent, args, context, info) => {
              
              console.log(context.koaContext.request)

              throw new ApolloError('activate uni vpn', 'WRONG_NETWORK')
              // call the next resolver
              const res = await next(parent, args, context, info);
              
              
              //context.koaContext.throw(407, 'Wrong network')
              //context.http.throw(407, 'Wrong network')
              console.log(context)

              return res;
            }
          ]*/
            /**
             * Basic middleware example #1
             * Log resolving time in console
             */
            /*
            },*/
            /**
             * Basic middleware example #3
             * change the 'name' attribute of parent with id 1 to 'foobar'
             */
            /*(resolve, parent, ...rest) => {
              if (parent.id === 1) {
                return resolve({...parent, name: 'foobar' }, ...rest);
              }

              return resolve(parent, ...rest);
            }*/
          
          //auth: false,
        },
      }
    })
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
