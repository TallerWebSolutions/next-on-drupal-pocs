# Consumo de API
* Uso do [Apollo Client](https://www.apollographql.com/docs/react/quick-start.html) para integração com APIs usando GraphQL
* É possível integrar com APIs GraphQL, mas também é possível usar os resolvers do Apollo Client para consultar endpoints escritos em outras arquiteturas (Rest ou Soap, por exemplo)
* React-apollo para integrar com o React e passar os dados consumidos para os componentes

```js
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import DropDown from '../components/DropDown'

const query = gql`
  query Articles {
    articles {
      title
    }
  }
`

export default graphql(query)(DropDown)
```

* Controle de estado: em alguns casos simples o Apollo pode substituir o Redux no controle de estados globais da aplicação (qual usuário está autenticado na sessão, por exemplo)

### Exemplo de helper para passar a informação de usuário logado a um componente:
```js
import * as R from 'ramda'
import { flattenProp, compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { whenClient, defaultProp } from 'app/lib/composition'

export const currentUserQuery = gql`
  query CurrentUser {
    user: currentUserContext {
      id
      status
      name
    }
  }
`

export const anonymous = {
  id: 0,
  status: 0,
  name: '',
}

export const withCurrentUser = compose(
  defaultProp('user', anonymous),
  compose(
    graphql(currentUserQuery),
    flattenProp('data'),
  ),
)
```
