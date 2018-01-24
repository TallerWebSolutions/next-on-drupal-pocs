import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, flattenProp } from 'recompose'

export const query = gql`
  query translationQuery($langcode: String!, $string: String!, $context: String!) {
    string: translation(langcode: $langcode, string: $string, context: $context)
  }
`

const Container = ({ data }) => (
  <div>
    <h1>Container</h1>
    <h1>{ data.string }</h1>
  </div>
)

const connectQuery = compose(
  graphql(query, { options: {
    variables: {
      langcode: 'pt-br',
      string: 'Comment type',
      context: ''
    }
  } }),
  flattenProp('data'),
)

export default connectQuery(Container)
