import Router from 'next/router'
import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

function PageList ({ data: { loading, error, allPageses } }) {
  if (error) return <ErrorMessage message='Error loading pages.' />
  if (allPageses && allPageses.length) {
    return (
      <section>
        <ul>
          {allPageses.map((page, index) =>
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
          a {
            font-size: 14px;
            margin-right: 15px;
            text-decoration: none;
            color: #333;
            text-align: center;
            text-transform: uppercase;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

export const allPageses= gql`
  query allPageses {
    allPageses {
      id
      description
      image
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPageses, {
  props: ({ data }) => ({
    data
  })
})(PageList)
