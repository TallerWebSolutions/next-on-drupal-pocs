# Criando um projeto

Criamos o projeto seguindo [Introdução do Next.js](docs/NEXTJS.md) e para utilizar o apollo-client iremos seguir o exemplo [Com apollo-client](https://github.com/zeit/next.js/tree/canary/examples/with-apollo) e implementar o PWA.

Criamos um diretório `lib` na raíz do projeto

```bash
$ mkdir lib
```

No diretório `lib`, criamos um arquivo em `lib/initApollo.js` com o seguinte conteúdo:

```javascript
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-unfetch'

let apolloClient = null

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

  const link = addDatesLink.concat(httpLink)

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    cache: cache,
    link
  })
}

export default function initApollo (initialState) {
  if (!process.browser) {
    return create(initialState)
  }

  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
```

Em seguida criamos um arquivo em `lib/withData.js` com o seguinte conteúdo:

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import Head from 'next/head'
import initApollo from './initApollo'

function getComponentDisplayName (Component) {
  return Component.displayName || Component.name || 'Unknown'
}

export default ComposedComponent => {
  return class WithData extends React.Component {
    static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`
    static propTypes = {
      serverState: PropTypes.object.isRequired
    }

    static async getInitialProps (ctx) {
      // Initial serverState with apollo (empty)
      let serverState = {
        apollo: {
          data: { }
        }
      }

      let composedInitialProps = {}
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx)
      }

      if (!process.browser) {
        const apollo = initApollo()

        const url = {query: ctx.query, pathname: ctx.pathname}
        try {

          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <ComposedComponent url={url} {...composedInitialProps} />
            </ApolloProvider>
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        }
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()

        // Extract query data from the Apollo store
        serverState = {
          apollo: {
            data: apollo.cache.extract(true)
          }
        }
      }

      return {
        serverState,
        ...composedInitialProps
      }
    }

    constructor (props) {
      super(props)
      this.apollo = initApollo(this.props.serverState.apollo.data)
    }

    render () {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      )
    }
  }
}
```

Em seguida, instalamos as dependências do `apollo-client`:

```bash
$ npm install apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag graphql isomorphic-unfetch apollo-link
```

Alteramos o `pages/index.js` para adaptar o apollo:

```javascript
import App from '../components/App'
import Header from '../components/Header'
import PageList from '../components/PageList'

import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <PageList />
  </App>
))
```

Criamos o `pages/products.js` com o seguinte conteúdo:

```javascript
import App from '../components/App'
import Header from '../components/Header'
import BlockList from '../components/BlockList'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <BlockList />
  </App>
))
```

Na pasta `components` deletamos uns arquivos e criamos alguns:

```bash
$ rm Submit.js PostList.js PostUpvoter.js
```

Em seguida criamos um arquivo em `components/PageList.js` com o seguinte conteúdo:

```javascript
import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function PageList ({ data: { loading, error, allPages } }) {
  if (error) return <ErrorMessage message='Error loading pages.' />
  if (allPages && allPages.length) {
    return (
      <section>
        <ul>
          {allPages.map((page, index) =>
            <li key={page.id}>
              <div>
                <span>{index + 1}. </span>
                <Link href="/products">
                  <a>{page.description}</a>
                </Link>
              </div>
            </li>
          )}
        </ul>
      </section>
    )
  }
  return <div>Loading</div>
}

export const allPages = gql`
  query allPages {
    allPages {
      id
      description
    }
  }
`

export default graphql(allPages, {
  props: ({ data }) => ({
    data
  })
})(PageList)
```

Depois criamos um arquivo em `components/BlockList.js` com o seguinte conteúdo:

```javascript
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function BlockList ({ data: { loading, error, allBlocks } }) {
  if (error) return <ErrorMessage message='Error loading blocks.' />
  if (allBlocks && allBlocks.length) {
    return (
      <section>
        <ul>
          {allBlocks.map((block, index) =>
            <li key={block.id}>
              <div>
                <span>{index + 1}. </span>
                <a href='javascript:;'>{block.title}</a>
              </div>
            </li>
          )}
        </ul>
      </section>
    )
  }
  return <div>Loading</div>
}

export const allBlocks = gql`
  query allBlocks {
    allBlocks {
      id
      title
      page(filter: {
        description: "Products"
      }) {
        id
      }
    }
  }
`

export default graphql(allBlocks, {
  props: ({ data }) => ({
    data
  })
})(BlockList)
```
