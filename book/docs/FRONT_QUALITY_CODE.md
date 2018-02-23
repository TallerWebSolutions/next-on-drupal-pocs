# Garantia da qualidade de código (QA)

Dentro os processos de garantia de qualidade do código, duas se destacam: padronização de código e testes automatizados.

## Padrão de código

### Code linting

No caso do JavaScript, sugere-se o uso do [`eslint`](https://esling.org). Ele pode ser usado em duas etapas: nos processos de build e no editor/IDE de código.

Para ambos os casos, será necessário instalar a lib `eslint` e adicionar um comando nos scripts da aplicação para a executação (`lint`).

Diversos editores tem plugins para exibir errors de `linting` diretamente na interface de desevolvimento. A exemplo, o [`linter-eslint`](https://atom.io/packages/linter-eslint) para o Atom.

Sugere-se o uso da seguinte configuração para o eslint: [eslint-config-taller](https://www.npmjs.com/package/eslint-config-taller)

#### Ignorar alguns arquivos

É importante configurar o linter para ignorar determinadas páginas, usando um arquivo `.eslintignore`, normalmente com configurações como estas:

```
.next
node_modules
temp
coverage
```

### Configurações do editor

Sugere-se a utilização de um arquivo de configuração para alterar os padrões do editor. Para isso, utiliza-se [editorconfig](http://editorconfig.org/) através da criação de um arquivo `.editorconfig` na raíz do projeto, como segue:

```
# More information at http://editorconfig.org/

root = true

[*]
charset                  = utf-8
end_of_line              = lf
indent_size              = 2
indent_style             = space
trim_trailing_whitespace = true

[*.php]
insert_final_newline = true
```

## Testes

Sugere-se usar [Jest](https://facebook.github.io/jest/), principalmente para aplicações que baseadas em React, para a criação de testes.

### Snapshot test
```js
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import DropDown from '../components/DropDown'

const items = [
  { title: 'Title 1' },
  { title: 'Title 2' },
  { title: 'Title 3' },
]

describe('[Component] DropDown', () => {
  it('should match the last shallow snapshot', () => {
    const component = shallow(<DropDown items={ items } />)
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should have class if open is true', () => {
    const component = shallow(<DropDown open items={ items } />)
    expect(component.find('li').first().hasClass('open')).toBe(true)
  })
})
```

####Output
``` shell
yarn test:unit src/components/DropDownTest/__tests__/DropDown.js
yarn test:unit v0.16.1
$ TZ='UTC' jest --config jest.config.json --verbose --no-cache src/components/DropDownTest/__tests__/DropDown.js
 PASS  src/components/DropDownTest/__tests__/DropDown.js
  [Component] DropDown
    ✓ should match the last shallow snapshot (12ms)
    ✓ should have class if open is true (4ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   1 passed, 1 total
Time:        2.16s
Ran all test suites matching "src/components/DropDownTest/__test
```

## Automatização do QA de código

### Integrado ao GIT

Automatização das verificações via [git-hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) ([Husky](HUSKY.md))

### Integrado ao CI

Devem-se executar os scripts de teste e linting nas esteiras de build (comandos devem estar inseridos nos scripts de build do Jenkins ou outro sistema de integração)
