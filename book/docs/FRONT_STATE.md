# Controle de estado
* É comum que os estados internos dos componentes do React não sejam suficientes para atender todas as regras de negócio da app, e isso traz a necessidade de estados globais
* Recomenda-se centralizar os estados globais da aplicação em um único fluxo
* O framework Redux auxilia nessa tarefa, criando um fluxo único de controle de estado
* Uma sugestão para facilitar a organização do fluxo do Redux é o Redux-boot, que é um bootstrap modular para se usar Redux

Exemplo de um módulo que usa o Redux com Redux-boot para atualizar o estado:

### Reducer
```js
const CURRENT_USER_SUCCESS = 'redux-boot/users/currentUser/SUCCESS'


const initialState = {
  user: {
    uid: 0,
    loggedIn: false,
    name: null,
    roles: [],
  }
}

export default {
  reducer: {
    [CURRENT_USER_SUCCESS]: (state, action) => {
      const { data: { user } } = action.payload
      return { ...state, ...user }
    },
  },

  middleware: {
    [BOOT]: store => next => action => {
      const result = next(action)

      store.dispatch(currentUserAction())

      return result
    },
  },
}
```

### Action
```js
import { normalize } from 'normalizr'

import request, { RequestError } from 'app/lib/request'
import user from '../../schema'

const CURRENT_USER_SUCCESS = 'redux-boot/users/currentUser/SUCCESS'

export const requestCurrentUser = () => request
  .get('/user/me')
  .query({ _format: 'jsonld' })
  .then({ body: { user } } => user)

const currentUserAction = () => ({
  types: [CURRENT_USER_SUCCESS],
  asyncKey: 'currentUser',
  promise: requestCurrentUser
})

export default currentUserAction
```
