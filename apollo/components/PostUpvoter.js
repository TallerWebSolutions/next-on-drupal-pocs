import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

function PostUpvoter ({ upvote, votes, id }) {
  return (
    <button onClick={() => upvote(id, votes + 1)}>
      {votes}
    </button>
  )
}

const upvotePost = gql`
  mutation updatePost($id: ID!, $votes: Int) {
    updatePost(id: $id, votes: $votes) {
      id
      __typename
      votes
    }
  }
`

export default graphql(upvotePost, {
  props: ({ ownProps, mutate }) => ({
    upvote: (id, votes) => mutate({
      variables: { id, votes },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePost: {
          __typename: 'Post',
          id: ownProps.id,
          votes: ownProps.votes + 1
        }
      }
    })
  })
})(PostUpvoter)
