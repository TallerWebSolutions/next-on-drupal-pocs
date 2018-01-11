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
                  <picture>
                    <source
                      media="(max-width: 320px)"
                      srcSet={`/static/${page.image}.jpg`} />
                    <source
                       media="(max-width: 480px)"
                       srcSet={`/static/${page.image}-480w.png`} />
                    <source
                       media="(max-width: 1000px)"
                       srcSet={`/static/${page.image}-800w.png`} />
                    <img src={`/static/${page.image}.jpg`} alt='pages' />
                  </picture>
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
