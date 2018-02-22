# Criação de componentes visuais (styleguide)

* São componentes [stateless](https://javascriptplayground.com/functional-stateless-components-react/), pois devem ser reaproveitáveis ao máximo, inclusive entre projetos diferentes. Por isso regras de negócio devem ficar fora desses componentes.
* Cuidam única e exclusivamente de sua apresentação visual, sem definir o próprio estado. Variações devem sempre ser controladas via propriedade pois isso evita que o componente funcione apenas num contexto específico
* Evitar ao máximo usar a api do browser diretamente, o React e o React-dom oferecem ferramentas para praticamente tudo o que é necessário implementar. Em último caso, implementar chamadas à api do browser de forma condicional evitando, assim, erros em sistemas que fazem renderização no server-side.
* Incluem um preview do [Storybook](https://storybook.js.org/) (showcase de componentes) no formato ComponentName.story.js. Esse preview serve para validações das implementações de layout e também para testar os componentes funcionando desacoplados da aplicação.

## Exemplo de um componente simples e meramente visual.
Nesse componente é possível observar:
* Uso de um stateless component
* Regras de lint já aplicadas
* Variações de exibição usando proprieades
* Implementação de estilos usando CSS Modules

```js
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './DropDown.css'

const itemClasses = open => classnames(
  styles.item,
  { [styles.open]: open },
)

const DropDown = ({ items, open, onTitleClick }) => (
  <ul className={ styles.list }>
    <h3 className={ styles.title } onClick={ onTitleClick }>Lista de itens:</h3>
    { items.map(({ title }, key) => (
      <li className={ itemClasses(open) } key={ key }>
        <span className={ styles.text }>{ title }</span>
      </li>
    )) }
  </ul>
)

DropDown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string
    })
  ),
  open: PropTypes.bool,
  onTitleClick: PropTypes.func,
}

export default DropDown

```
