import fetch from 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
// import { createApolloFetch } from 'apollo-fetch'
import { createUploadLink } from 'apollo-upload-client'
// import { createApolloFetchUpload } from 'apollo-fetch-upload'
import { createHttpLink } from 'apollo-link-http'
// import { BatchHttpLink } from 'apollo-link-batch-http'
// import { persistCache } from 'apollo-cache-persist'

import { isDevelopment, isClient, isServer } from 'app/lib/func'
import { extractCacheTags } from 'app/lib/cacheTagsAfterware'

const GRAPHQL_HOST = 'http://localhost/graphql'

// Polyfill fetch() if needed. Useful for server-side code.
const fetcher = global.fetch || fetch

// Override fetch to always include credentials.
// @TODO: could this be done elsewhere?
global.fetch = (uri, options = {}) => {
  options.credentials = 'include'
  return fetcher(uri, options)
}

/**
 * ID normalization. Will use, in order of precedence, a provided 'id', '_id', or
 * 'entityId' field as unique identificator, prefixed with the object's type.
 *
 * Fallbacks to default normalization system.
 *
 * @param {String} id The object's unique id.
 * @param {String} _id The object's unique id.
 * @param {String} entityId The object's unique id.
 * @param {String} __typename The object's type in GraphQL.
 *
 * @return {!String} Either a unique identificator if found, or nil.
 */
const dataIdFromObject = ({ id, _id, entityId, __typename }) => id || _id || entityId
  ? `${__typename}:${id || _id || entityId}`
  : undefined

/**
 * Verifies if the given operation has a mutation.
 */
const isMutation = operation => operation.query.definitions[0].operation === 'mutation'

/**
 * Given an operation body, transform it into a get query-strings.
 */
const operationToQueryString = operationString => {
  const operation = JSON.parse(operationString)

  // @TODO: this should be handled prior to this, probably.
  operation.query = operation.query.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s\s+/g, ' ')

  return '?' + Object.keys(operation)
    .map(key => `${key}=${JSON.stringify(operation[key])}`)
    .join('&')
}

/**
 * Transform a POST fetch request into a GET request.
 */
const graphqlGETFetcher = (uri, { body, ...options }) => global.fetch(
  uri + operationToQueryString(body),
  { ...options, method: 'GET' }
)

/**
 * Creates a enhanced Apollo Link.
 * 1 - Uses GET when possible;
 * 2 - Does File upload;
 * 3 - Cache-tag aware.
 */
const createLink = context => {
  const cacheTagExtractor = extractCacheTags(context)

  const httpLinkGET = createHttpLink({ uri: GRAPHQL_HOST, fetch: cacheTagExtractor(graphqlGETFetcher) })
  const httpLinkPOST = createUploadLink({ uri: GRAPHQL_HOST, fetch: cacheTagExtractor(global.fetch) })

  /*
   * Switch link between query/mutation.
   *
   * Queries are data consumption and should be cached - they use GET.
   * Mutations are data alteration should never be cached - they use POST.
   */
  return split(isMutation, httpLinkPOST, httpLinkGET)
}

/**
 * Creates a new ApolloClient instance.
 *
 * @param {Object} initialState Hydrating state.
 * @return {ApolloClient}.
 */
const create = ({ initialState = {}, context }) => new ApolloClient({
  connectToDevTools: isClient() && isDevelopment(),
  ssrMode: isServer(), // Disables forceFetch on the server (so queries are only run once)
  link: createLink(context),
  cache: new InMemoryCache({ dataIdFromObject }).restore(initialState)
})

let apolloClient = null

/**
 * Initialize ApolloClient for either server ou client side.
 */
export default state => isClient()
  // On the CLIENT, always reuse any available ApolloClient instance.
  ? apolloClient || (apolloClient = create(state))

  // On the SERVER, always create a new ApolloClient instance.
  // @TODO: we should reconsider this. Maybe it is best to consider SSR execution
  // as an anonymous request always, and let contextual data be handled on the client,
  // thus improving performance for the majority of users, which are anonymous.
  : create(state)
