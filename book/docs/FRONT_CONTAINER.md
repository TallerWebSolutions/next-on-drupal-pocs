# Criação de containers

* HOC que acoplam dados e lógica nos componentes visuais
* Não devem incluir código de componentes, apenas acoplar lógica e dados em outros componentes
* Responsável por passar valores para propriedades, definir estados e alterações dos mesmos, e criar funções que servem como handlers para eventos dos componentes de apresentação
* Nesses containers, para utilizar recursos do React, utiliza-se o [Recompose](https://github.com/acdlite/recompose)

## Exemplo de um container ou smart component
Nesse exemplo é possível obervar:
* Uso do Recompose
* Acoplamento de dados usando React-apollo
* Tratamento do estado fora do componente visual
* Nenhum código de componente de fato, apenas acoplamento de dados e lógica a outro componente

```
import { compose, withHandlers, withState, flattenProp, renameProp } from 'recompose'
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

const onTitleClick = ({ open, setOpen }) => () => setOpen(!open)

export default compose(
  graphql(query),
  flattenProp('data'),
  renameProp('articles', 'items'),
  withState('open', 'setOpen', false),
  withHandlers({ onTitleClick }),
)(DropDown)

```
