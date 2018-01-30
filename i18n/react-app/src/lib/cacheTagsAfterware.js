import * as R from 'ramda'
import { isDevelopment, isClient } from 'app/lib/func'

// During development, use Drupal's own cache-tags header.
const headerName = isDevelopment() ? 'X-Drupal-Cache-Tags' : 'Cache-Tag'
const separator = isDevelopment() ? ' ' : ','
const split = R.split(separator)
const mergeTags = R.pipe(R.concat, R.uniq, R.join(separator))

// @TODO: should be removed on the Drupal side.
const ignoringTags = [
  'entity_bundles',
  'entity_field_info',
  'entity_types',
  'graphql_response',
  'graphql_response:default',
  'graphql_schema',
  'graphql_schema:default',
  'handy_cache_tags:node:article_columnist',
  'http_response',
  'user_login',
  'user_logout'
]

/**
 * Cache Tags middleware.
 * @param {Object} context
 */
export const extractCacheTags = context => fetcher => (...args) => fetcher(...args)
  .then(response => {
    // Short exist on client or when no response is available (SSR).
    if (isClient() || !context.res) return response

    // response.headers.forEach(console.log)

    // Short exist if no cache-tags are found on the response.
    if (!response.headers.has(headerName)) return response

    // Get header current raw value
    const currentValue = context.res.get(headerName)

    // Get an array of current cache-tags.
    const tagsBuffer = currentValue ? split(currentValue) : []

    // Get new cache tags.
    let newTags = split(response.headers.get(headerName))

    // @TODO: understand why some additional tags are being passed.
    // Remove config tags.
    newTags = newTags.filter(name => name.indexOf('config:') !== 0)
    newTags = newTags.filter(name => ignoringTags.indexOf(name) === -1)

    // console.log({ operation: JSON.parse(args[1].body).operationName, newTags })

    // Construct new value for the header combining new tags to old ones.
    const newHeader = mergeTags(tagsBuffer, newTags)

    // Save the new hader value to the server response.
    context.res.set(headerName, newHeader)

    return response
  })
