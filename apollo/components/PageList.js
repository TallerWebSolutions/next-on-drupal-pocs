import Router from 'next/router'
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
              <Link href='/products'>
                <a>
                  <img src={`/static/${page.image}`} alt='pages' />
                  <p>{page.description}</p>
                </a>
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
          hr {
             display: block;
             position: relative;
             padding: 0;
             margin: 8px auto;
             height: 0;
             width: 100%;
             max-height: 0;
             font-size: 1px;
             line-height: 0;
             clear: both;
             border: none;
             border-top: 1px solid #aaaaaa;
             border-bottom: 1px solid #ffffff;
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
