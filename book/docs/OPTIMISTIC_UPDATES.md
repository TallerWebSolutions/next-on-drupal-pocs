# Optimistic Updates

Esse é um conceito que combina bastante com interfaces reativas a aplicações *serverless*.

Ele funciona assim: quando o usuário executa uma ação que modifica alguma informação no servidor e que deve também representar uma mudança na aplicação, faz-se a atualização da interface independentemente do resultado da alteração no *backend*. Quando a resposta do servidor for retornada, o restultado *otimista* é substituído pelo resultado real.

O [Apollo](APOLLO_BASIC.md) nos ajuda a implementar esse conceito de maneira bastante simples. Isso acontece porque ele cacheia por padrão o resultado de uma mutação.

## Exemplo: atualizar um artigo

```js
const updateArticle = gql`
  mutation updateArticle($id: ID!, $title: String!) {
    updateArticle(id: $id, title: $title) {
      id
      title
    }
  }
`

export default graphql(updateArticle, {
  props: ({ ownProps, mutate }) => ({
    submit({ id, title }) => mutate({
      variables: { id, title },
      optimisticResponse: {
        __typename: 'Mutation',
        updateArticle: { id, title }
      }
    })
  })
})(Article)
```

## Referências
* https://www.apollographql.com/docs/react/features/optimistic-ui.html
* https://dev-blog.apollodata.com/tutorial-graphql-mutations-optimistic-ui-and-store-updates-f7b6b66bf0e2
