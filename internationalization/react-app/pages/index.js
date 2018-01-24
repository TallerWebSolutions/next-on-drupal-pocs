import React from 'react'
import PropTypes from 'prop-types'
import { compose, whithContext, withProps, withHandlers, lifecycle } from 'recompose'
import { translate } from 'react-i18next'
import i18n from '../i18n'
import withData from 'app/lib/withData'

import Container from 'app/components/container'

// import Translate, { withTranslate } from '../components/translate'
// import { withTranslate } from '../components/translate1'

// const Foo = withTranslate(props => (<pre>{ JSON.stringify(props, null, 2) }</pre>))

// const Home = (props) => (
//   <div>
//     <h1>Test agregation</h1>
//     <Translate reset str={ ['teste pai'] }>
//       <Translate str={ ['teste filho'] }>
//         <Translate str={ ['teste filho filho'] }>
//           <Foo />
//         </Translate>
//       </Translate>
//       <Translate str={ ['teste filho2'] }>
//         <Translate str={ ['teste filho filho2'] }>
//           <Foo />
//         </Translate>
//       </Translate>
//     </Translate>
//   </div>
// )

// const InnerComponent = () => (
//   <h2><Translate>Inner test</Translate></h2>
// )

// const Home = (props) => (
//   <div>
//     <h1><Translate>Test aggregation</Translate></h1>
//     <InnerComponent />
//   </div>
// )

// const Home = ({ t, translate, locale }) => (
//   <div>
//     TESTE
//     { t({ a: 'teste1' }) }
//     { t({ b: 'teste2' }) }
//   </div>
// )

const Home = () => (
  <div>
    <Container />
  </div>
)

// const Extended = translate(['home'], { i18n, wait: process.browser })(Home)
//
// Extended.getInitialProps = async ({ req }) => {
//   if (req && !process.browser) return i18n.getInitialProps(req, ['home'])
//   return {}
// }

// export default compose(
//   translate(['home'], { i18n, wait: process.browser }),
//   // withProps({ 'strArray': [] }),
//   // withHandlers({
//   //   locale: ({ strArray }) => e => strArray.push(e)
//   // }),
//   // lifecycle({
//   //   componentDidMount() {
//   //     this.props.t(this.props.strArray)
//   //   }
//   // }),
// )
// (Home)

export default withData(Home)
