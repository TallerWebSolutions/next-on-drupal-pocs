# Techs / libs utilizadas, por que e exemplo.
  * Eslint
  * EditorConfig (espaço em vez de tabs, etc...)
  * Jest para testes
  * Husky
  * React Router (?)
  * Redux
  * Ramda
  * Recompose

## Eslint

### Por quê?

  * Código limpo e consistente entre os times.
  * Facilidade na configuração de regras.
  * Abilidate de escrever seus propias plug-ins e regras.

### Como ?

  No arquivo `.eslinrc` é definido a configuração e as regras do EsLint.    

```
/* @file: .eslintrc */
{
  globals: {
    __DEV__: false,
    __MOCK_GRAPHQL__: false,
    drupalSettings: false,
    xdescribe: false,
    xit: false  
  },
  rules: {
    no-mixed-operators: 0,
    import/first: 0,
    prefer-promise-reject-errors: 0
  }
}
```

A Taller tem  um repostorio  [eslint-config-taller](https://github.com/TallerWebSolutions/eslint-config-taller) com as configurações Eslint utilizadas no seus projetos React. Pra utilizar ele é instalar e acrecentar a linha de embaixo no `.eslintrc`.

```
/* @file: .eslintrc */
{
+ extends: ["taller/react"],
  ...
}
```

## EditorConfig

* Spaces over tabs (2 spaces).


## Jest

[Jest](https://facebook.github.io/jest/) é um framework de JavaScript pra fazer testes unitarios.

### Por quê?

* React integration.
* Fácil de configurar.
* Fácil criação de mocks.
* Snapshot testing.

<!-- * Spy // if a functions is called  
* Stub // fake object with fake returns
* Mock // -->


**References:**
* http://andrew.codes/jest-vs-mocha-why-jest-wins/

### Como ?

É definido dois comandos para rodar os testes. O primeiro é usado nos deploys e o segundo no desenvolvimento de testes, porque ele fica escutando e executando as mudanças dos testes ao mesmo tempo.

```
/* @file: package.json */

{
  ...
  scripts: {
    ...
    "test:unit": "./node_modules/jest/bin/jest.js",
    "test:unit:watch": "yarn test:unit -- --watch"
  },
  ...
}
```

A configuração do Jest é definido no arquivo `package.json`.

```
/* @file: package.json */

{
  ...

  "jest": {
    "setupFiles": [
      "<rootDir>/enzyme.setup.js"
    ],
    "collectCoverage": true,
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/.next",
      "<rootDir>/temp"
    ]
  }
}
```

## Enzyme

[Enzyme](http://airbnb.io/enzyme/) is a JavaScript utility library for testing React components.

### Por quê?

* Convenient utilities to work with shallow rendering, static rendered markup or DOM rendering.
* jQuery-like API to find elements, read props, etc.

### Como ?

```
/* @file: enzyme.setup.js */

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
```

```
/* @file: package.json */

{
  ...

  "jest": {
+   "setupFiles": [
+     "<rootDir>/enzyme.setup.js"
+   ],
    "collectCoverage": true,
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/.next",
      "<rootDir>/temp"
    ]
  }
}
```

**References:**
* https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
* http://codeheaven.io/testing-react-components-with-enzyme/

## Husky

### Por quê?

### Como ?


## React Router (?)

### Por quê?

### Como ?


## Redux

### Por quê?

### Como ?


## Ramda

### Por quê?

### Como ?


## Recompose

### Por quê?

### Como ?
