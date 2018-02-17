# Acessibilidade com React

acessibilidade para web conhecido como [a11y](https://en.wiktionary.org/wiki/a11y) é suportado pelo React para poder criar aplicações acessiveis.

## WAI-ARIA

Iniciativa [Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) contem técnicas para construir widgets de JavaScript totalmente acessíveis.

**Exemplo:**

```javascript
<input
  type='text' 
  aria-label={ labelText }
  aria-required='true'
  onChange={ onchangeHandler }
  value={ inputValue }
  name='name'
/>
```
Repare nos atributos `aria-*` no elemento de html.

### HTML semántico

O HTML semântico é a base da acessibilidade em uma aplicação web. Usar os vários elementos HTML para reforçar o significado da informação em nossos sites geralmente nos dará acessibilidade gratuitamente.

Para evitar `<div>` desnecessarios só para fazer o JSX funcionar de maneira que é retornado um elemento englobando varios.
Esta limitação não existe mais no React 16 por aceitar retornar um array de componentes.

**Exemplo com Fragment:**
```javascript
import React, { Fragment } from 'react';

const Glossary = ({ items }) => (
  <dl>
    { items.map(item => (
      // Without the `key`, React will fire a key warning
      <Fragment key={ item.id }>
        <dt>{ item.term }</dt>
        <dd>{ item.description }</dd>
      </Fragment>
    )) }
  </dl>
)
```

**Exemplo sem Fragment:**

Repare que é só o item da lista.

```javascript
import React from 'react';

const ListItem = ({ item }) => (
  <>
    <dt>{ item.term }</dt>
    <dd>{ item.description }</dd>
  </>
)
```

## [Formulários accessíveis](https://reactjs.org/docs/accessibility.html#accessible-forms)

## [Controle do foco (focus)](https://reactjs.org/docs/accessibility.html#focus-control)

## Bibliotecas para usar com o React

Existe uma lib chamada [react-a11y](https://github.com/reactjs/react-a11y) que notifica possíveis impactos na acessibilidade dado ao JSX que foi escrito para desenvolver os componentes.

A lib `react-a11y` pode ser utilizada em conjunto com o [eslint](https://eslint.org/) usando a lib [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y).

**Exemplo:**

Adicione no arquivo `.eslintrc` da seguinte maneira:

```json
{
  "plugins": [
    "jsx-a11y"
  ]
}
```

Adicionando um preset de regras recomendadas pela lib:

```json
{
  "plugins": [
    "jsx-a11y"
  ],
  "extends": [
    "plugin:jsx-a11y/recommended"
  ]
}
```

[Veja aqui uma lista das regras suportadas.](https://github.com/evcohen/eslint-plugin-jsx-a11y#supported-rules)

Assumindo que no pipeline do CI/CD é executado o `npm run lint` se alguma regra não passar automaticamente o build vai falhar. Aconselhamos utilizar algo como [husky](https://github.com/typicode/husky/tree/master) para evitar que o desenvolvedor consigo dar push de código que não passou pelo `eslint`.

**Exemplo prepush:**

Arquivo `package.json`:

```json
{
  "name": "accessibility",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "jest .",
    "dev": "next",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "prepush": "npm run lint && npm run test"
  },
  ...
}
```