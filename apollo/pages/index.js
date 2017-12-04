import Header from '../components/Header'
import Submit from '../components/Submit'
import PostList from '../components/PostList'
import withData from '../lib/withData'

export default withData(props => (
  <div>
    <Header pathname={ props.url.pathname } />
    <Submit />
    <PostList />
  </div>
))
