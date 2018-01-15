import '../utils/offline-install'
import Head from 'next/head'
import App from '../components/App'
import Header from '../components/Header'
import PageList from '../components/PageList'
import withData from '../lib/withData'

export default withData((props) => (
  <div>
    <Head>
      <link rel="manifest" href="/static/manifest.json" />

      <meta httpEquiv='x-ua-compatible' content='ie=edge' />

      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charset="utf-8" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/static/favicon.ico" />

      <title>PWA with Apollo</title>
    </Head>
    <App>
      <Header pathname={props.url.pathname} />
      <PageList />
    </App>
  </div>
))
