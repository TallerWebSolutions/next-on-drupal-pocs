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

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allBlocks, {
  props: ({ data }) => ({
    data
  })
})(BlockList)
