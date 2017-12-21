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
