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
              <img src={`/static/${block.image}`} alt='products' />
              <h4>{block.title}</h4>
              <p>description product</p>
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

export const blocks = gql`
  query blocks {
    allBlocks {
      id
      title
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(blocks, {
  props: ({ data }) => ({
    data
  })
})(BlockList)
