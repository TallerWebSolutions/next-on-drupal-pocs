# Criando um projeto

Criar o projeto seguindo [PWA com Apollo](APOLLO.md).

No diretório `pages`, alterar o arquivo `_document.js` com o seguinte conteúdo:

```javascript
import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App { ...props } />))
    const styleTags = sheet.getStyleElement()

    /**
     * We won't really use "page" object for Head, Main, and NextScript already
     * cover injecting the output content to the page.
     */
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          <link rel="manifest" href="/static/manifest.json" />

          <meta httpEquiv='x-ua-compatible' content='ie=edge' />

          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charset="utf-8" />
  				<meta name="theme-color" content="#000000" />
  				<link rel="icon" href="static/favicon.ico" />
          <script src="https://cdn.rawgit.com/scottjehl/picturefill/3.0.2/dist/picturefill.min.js" />

  				<title>PictureFill</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
```
> Incluído o _POLYFILL_ `<script src="https://cdn.rawgit.com/scottjehl/picturefill/3.0.2/dist/picturefill.min.js" />` para os navegadores que não suportam.

Em seguida, alterar o arquivo `components/PageList.js` com o seguinte conteúdo:

```javascript
import Router from 'next/router'
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
              <Link href='/products'>
                <a>
                  <picture>
                    <source
                      media="(max-width: 320px)"
                      srcSet={`/static/${page.image}.jpg`} />
                    <source
                       media="(max-width: 480px)"
                       srcSet={`/static/${page.image}-480w.png`} />
                    <source
                       media="(max-width: 1000px)"
                       srcSet={`/static/${page.image}-800w.png`} />
                    <img src={`/static/${page.image}.jpg`} alt='pages' />
                  </picture>
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

export const allPages = gql`
  query allPages {
    allPages {
      id
      description
      image
    }
  }
`

export default graphql(allPages, {
  props: ({ data }) => ({
    data
  })
})(PageList)
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPages, {
  props: ({ data }) => ({
    data
  })
})(PageList)
```

> Alteração ->
```javascript
<picture>
  <source
    media="(max-width: 320px)"
    srcSet={`/static/${page.image}.jpg`} />
  <source
     media="(max-width: 480px)"
     srcSet={`/static/${page.image}-480w.png`} />
  <source
     media="(max-width: 1000px)"
     srcSet={`/static/${page.image}-800w.png`} />
  <img src={`/static/${page.image}.jpg`} alt='pages' />
</picture>
```

Em seguida, alterar o arquivo `components/BlockList.js` com o seguinte conteúdo:

```javascript
import Link from 'next/link'
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

              <picture>
                <source
                  media="(max-width: 320px)"
                  srcSet={`/static/${block.image}.jpg`} />
                <source
                   media="(max-width: 480px)"
                   srcSet={`/static/${block.image}-480w.png`} />
                <source
                   media="(max-width: 1000px)"
                   srcSet={`/static/${block.image}-800w.png`} />
                <img src={`/static/${block.image}.jpg`} alt='products' />
              </picture>

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

export const allBlocks = gql`
  query allBlocks {
    allBlocks {
      id
      title
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allBlocks, {
  props: ({ data }) => ({
    data
  })
})(BlockList)
```
> Alteração ->
```javascript
<picture>
  <source
    media="(max-width: 320px)"
    srcSet={`/static/${block.image}.jpg`} />
  <source
     media="(max-width: 480px)"
     srcSet={`/static/${block.image}-480w.png`} />
  <source
     media="(max-width: 1000px)"
     srcSet={`/static/${block.image}-800w.png`} />
  <img src={`/static/${block.image}.jpg`} alt='products' />
</picture>
```
