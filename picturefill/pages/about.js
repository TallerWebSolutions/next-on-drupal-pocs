import React from 'react'
import App from '../components/App'
import Header from '../components/Header'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <h2>About POC-PWA</h2>
    <p>Sagittis cupidatat beatae quisque nec aliquid mus veniam? Repudiandae hic. Ex ad nisi praesent dolor, nibh? Venenatis nisi cupidatat nostrum neque wisi ab. Delectus laoreet vel mollis lacinia quas similique aliqua ornare semper mollitia exercitation molestie maxime praesent, praesentium fames. Optio dis doloribus fringilla vulputate.</p>
  </App>
))
