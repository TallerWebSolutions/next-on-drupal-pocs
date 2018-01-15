# Criando um projeto

Criar o projeto seguindo a [Introdução ao Next.js](NEXTJS.md). Para utilizar o [Apollo](https://www.apollographql.com/client/) iremos partir do [exemplo com apollo-client](https://github.com/zeit/next.js/tree/canary/examples/with-apollo) e, então, implementar o _Progressive Web App_ (PWA).

Criar um diretório `lib` na raíz do projeto:

```bash
$ mkdir lib
```

No diretório `lib`, criar o arquivo `initApollo.js` com o seguinte conteúdo:

```javascript
import { ApolloLink } from 'apollo-link'
import { RetryLink } from 'apollo-link-retry'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
//import { persistCache } from 'apollo-cache-persist'
import { persistCache } from 'apollo-cache-persist'
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

  if (process.browser) {
    persistCache({
      cache,
      storage: window.localStorage,
      key: 'pwa',
      debug: true
    })
  }

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

```

Em seguida, criar o arquivo `lib/withData.js` com o seguinte conteúdo:

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

Em seguida, instale as dependências do `apollo-client`:

```bash
$ npm install apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag graphql isomorphic-unfetch apollo-link
```

Após finalizada a instalação, altere o arquivo `pages/index.js` para utilizar o Apollo através do `withData`:

```javascript
import '../utils/offline-install'
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

Criar o arquivo `pages/products.js` com o seguinte conteúdo:

```javascript
import App from '../components/App'
import Header from '../components/Header'
import BlockList from '../components/BlockList'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <BlockList pageId={props.url.query.pageId} />
  </App>
))
```

Na pasta `components`, deletar os arquivos `Submit.js`, `PostList.js` e `PostUpvoter.js`:

```bash
$ rm Submit.js PostList.js PostUpvoter.js
```

Em seguida criar o arquivo `components/PageList.js` com o seguinte conteúdo:

```javascript
import Router from 'next/router'
import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function PageList ({ data: { loading, error, allPageses } }) {
  if (error) return <ErrorMessage message='Error loading pages.' />
  if (allPageses && allPageses.length) {
    return (
      <section>
        <ul>
          {allPageses.map((page, index) =>
            <li key={page.id}>
              <Link href='/products'>
                <a>
                  <img src={`/static/${page.image}`} alt='pages' />
                  <p>{page.description}</p>
                </a>
              </Link>
            </li>
          )}
        </ul>
        <style jsx>{`
          ul {
            padding-left: 0px;
            list-style-type: none;
            margin-top: 10px;
          }
          ul img {
            width: 100%;
            height: auto;
            display: inline-block;
            margin: 0 20px 10px 0;
          }
          li {
            padding-right: 20px;
            border-left: none;
            border-right: none;
            display: inline-block;
          }
          a {
            font-size: 14px;
            margin-right: 15px;
            text-decoration: none;
            color: #333;
            text-align: center;
            text-transform: uppercase;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

export const allPageses= gql`
  query allPageses {
    allPageses {
      id
      description
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPageses, {
  props: ({ data }) => ({
    data
  })
})(PageList)
```

Depois, criar o arquivo `components/BlockList.js` com o seguinte conteúdo:

```javascript
import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function BlockList ({ data: { loading, error, allBlockses } }) {
  if (error) return <ErrorMessage message='Error loading blocks.' />
  if (allBlockses && allBlockses.length) {
    return (
      <section>
        <ul>
          {allBlockses.map((block, index) =>
            <li key={block.id}>
              <img src={`/static/${block.image}`} alt='products' />
              <h4>{block.title}</h4>
              <p>Product description. consequat excepturi ullam aliquip. Egestas quidem gravida iaculis, voluptates ratione debitis.</p>
            </li>
          )}
        </ul>
        <style jsx>{`
          ul {
            padding-left: 0px;
            list-style-type: none;
            margin-top: 10px;
          }
          ul img {
            width: 100%;
            height: auto;
            display: inline-block;
            margin: 0 20px 10px 0;
          }
          li {
            padding-right: 20px;
            border-left: none;
            border-right: none;
            display: inline-block;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

export const allBlockses = gql`
  query allBlockses {
    allBlockses {
      id
      title
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allBlockses, {
  props: ({ data }) => ({
    data
  })
})(BlockList)
```
