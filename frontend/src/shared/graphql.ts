import { InMemoryCache, ApolloClient } from '@apollo/client/core'
import { createHttpLink } from '@apollo/client/link/http'
import { ApolloLink } from '@apollo/client/link/core/ApolloLink'
import fetch from 'cross-fetch'
import { ApolloClients } from '@vue/apollo-composable'

import type { ApolloClientOptions, NormalizedCacheObject } from '@apollo/client/core'
import type { ApolloClients as SSRApolloClients } from '@vue/apollo-ssr'
import type { App } from 'vue'

/*import { onError } from '@apollo/client/link/error'

const errorlink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})*/

function networkMiddleware(networkToken: string)
{
  return new ApolloLink((operation, forward) =>
  {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'network-token': networkToken
      }
    }))
    return forward(operation)
  })
}

function genClients(networkToken?: string)
{
  const http = createHttpLink({ uri: (import.meta.env.SSR) ? 'http://strapi:1337/graphql' : 'https://fsmpi.uni-bayreuth.de/v1/graphql', fetch, /*useGETForQueries: true,*/ credentials: 'same-origin' })

  const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    link: (import.meta.env.SSR && networkToken) ? networkMiddleware(networkToken).concat(http) : http,
    cache: !import.meta.env.SSR
    //@ts-ignore
      ? new InMemoryCache().restore((<Object>window.__APOLLO_STATE__).default)
      : new InMemoryCache(),
    ...(import.meta.env.SSR ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100
    })
  }

  if (!import.meta.env.SSR)
    Array.from(window!.document!.getElementsByTagName('script'))!.find((val)=>
    {
      return val.text.startsWith("window.__APOLLO_STATE__")
    })!.remove()

  let clients: SSRApolloClients = {}
  clients["default"] = new ApolloClient(apolloOptions)

  return clients
}

export function createGraphql(networkToken?: string)
{
  const clients = genClients(networkToken)
  return {
    clients,
    install(app: App)
    {
      //for (const key in clients)
      app.provide(ApolloClients, clients)
    }
  }
}
