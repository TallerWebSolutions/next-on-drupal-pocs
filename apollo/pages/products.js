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
