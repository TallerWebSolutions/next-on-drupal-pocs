# Automatização de verificações - Husky

Git hooks são scripts que rodam automaticamente cada vez que você realiza alguma ação em particular no repositório Git. Eles permitem modificar o comportamento interno do Git e adicionar triggers customizáveis em vários pontos chave do ciclo de desenvolvimento. Ele é utilizado quando existe a necessidade de automatizar as verificações antes de realizar push ou commit, para que alguns pré requisitos sejam satisfeitos. Como Testes ou Lint. O **Husky** é uma lib que simplifica a utilização do githook.

## Instalação

Adicione o Husky ao seu projeto usando o npm ou yarn:
```bash
  $ npm install husky --save-dev
```
ou
```bash
  $ yarn add husky --dev
```

## Configuração
O Husky suporta todos git hooks, pode vê-los clicando [aqui](https://github.com/typicode/husky/blob/master/HOOKS.md). Por padrão adicionamos os scripts de execução na pasta scripts e os nomeamos com o mesmo nome do hook. Abaixo tem um exemplo de como adicionar os hooks no package.js:

```json
// ./package.json
{
    "scripts":{
        "lint": "eslint .",
        "test:unit": "./node_modules/jest/bin/jest.js",
        "prepush": "yarn lint && yarn test:unit",
        "..." : "..."
    }
}
```

## Utilização
No exemplo acima, configuramos o Husky para executar um hook quando for utilizado um `git push`. Abaixo segue um exemplo simples do workflow do Husky:
```
$ git push origin master
```
Ele executará o comando `yarn lint && yarn test:unit`.
Se não existir nenhum problema com o lint ou com os teste do projeto, ele dará continuidade a execução do `git push`.
Caso tenha algum erro com o lint ou com os testes, será exibido no terminal e a execução do push será cancelada.

### Ignorar o Husky
Se por algum motivo desejar ignorar a validação do Husky, execute o git com a flag `--no-verify` da seguinte forma:
```
$ git push origin master --no-verify
```
