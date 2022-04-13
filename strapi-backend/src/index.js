'use strict';

const { ApolloError } = require('apollo-server-errors');
const { verify } = require('jsonwebtoken')

/*export class MyError extends ApolloError {

  constructor(message) {

    super(message, 'WRONG_NETWORK');
    Object.defineProperty(this, 'name', { value: '407' });

  }

}*/
function isValidIp(context)
{
  return context.http.request.header['x-real-ip'] === '192.168.178.32'
}

function isValidJwt(context)
{
  const jwt = context.http.request.header['network-token']
  //console.log(jwt)
  if (!jwt)
    return false
  try {
    const token = verify(jwt, 'klandfgjklandfskjhgaksjdnlkösajkdfoijasldkjflkasdnfasoiehjo')
  }
  catch (err) {
    return false
  }
  return true
}

function checkUniNetwork(context)
{
  if (!isValidIp(context) && !isValidJwt(context))
    throw new ApolloError('activate uni vpn', 'WRONG_NETWORK')
}


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
   register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    //console.log(extensionService.shadowCRUD('api::uni-kino-filme.uni-kino-filme').field('datum'))

    extensionService.use({
      //const res = 
      resolversConfig: {
        'Query.uniKinoFilmes': {
          policies: [
            (context, { strapi }) => {

              checkUniNetwork(context)

              return true;
            }
          ],
          auth: false
        },
        'UniKinoFilme.localizations': {
          policies: [
            (context, { strapi }) => {
              checkUniNetwork(context)

              return true;
            }
          ],
          auth: false
        }
      },
    })

    const extension = ({ nexus }) => ({
      // Nexus
      types: [
        nexus.extendType({
          type: 'Query',
          definition(t) {
            t.field('uniKinoDates', {
              type: nexus.nonNull(nexus.list('DateTime'))
            })
          }
        })
      ],
      resolvers: {
        Query: {
          uniKinoDates: {
            async resolve() {
              const res = (await strapi.service('api::uni-kino-filme.uni-kino-filme').find()).results.map(({datum}) => { return datum })
              return res;
            },
          },
        },
      },
      resolversConfig: {
        'Query.uniKinoDates': {
          auth: false,
        },
      },
    });
    extensionService.use(extension)
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
