import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function PageList ({ data: { loading, error, allPages } }) {
  if (error) return <ErrorMessage message='Error loading pages.' />
  if (allPages && allPages.length) {
    return (
      <section>
        <ul>
          {allPages.map((page, index) =>
            <li key={page.id}>
                <img src={`../static/img/${page.image}`} alt='pages' />
                <Link href="/products">
                  <a><p>{page.description}</p></a>
                </Link>
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
            width: 100px;
            height: 100px;
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

export const allPages = gql`
  query allPages {
    allPages {
      id
      description
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPages, {
  props: ({ data }) => ({
    data
  })
})(PageList)
