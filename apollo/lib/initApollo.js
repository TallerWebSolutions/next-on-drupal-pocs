import { ApolloLink } from 'apollo-link'
import { RetryLink } from 'apollo-link-retry'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-unfetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState) {
  const cache = new InMemoryCache().restore(initialState || {})

  const httpLink = createHttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjatzjtkl26rv0105sypiowg2',
    credentials: 'same-origin'
  })

  const addDatesLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      return response
    })
  })

  // use with apollo-client
  const link = addDatesLink.concat(httpLink)

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    cache: cache,
    link
  })


  // return new ApolloClient({
  //   connectToDevTools: process.browser,
  //   ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
  //   link: new HttpLink({
  //     uri: 'https://api.graph.cool/simple/v1/cjatzjtkl26rv0105sypiowg2', // Server URL (must be absolute)
  //     credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
  //   }),
  //   cache: cache,
  //   link
  // })
}

export default function initApollo (initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
