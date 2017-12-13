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
                <img src={`../static/img/${block.image}`} alt='products' />
                <p>{block.title}</p>
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
            float: left;
            width: 100px;
            height: 100px;
            display: inline-block;
            margin: 0 20px 10px 0;
          }
          p {
            overflow: hidden;
            flex-basis: 20%;
          }
          li {
            display: flex;
            flex-basis: 60%;
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
      page(filter: {
        id: "cjb3mcwvcgj030144lpdxu8et"
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
