# Estilos

* O ideal é que os estilos acompanhem os componentes visuais de forma escopada, para que cada componente consiga carregar sua aparência sem depender de nenhum contexto e também não interfira na aparência de outros componentes.
* Existem alguns conceitos técnicos que tornam isso possível, entre eles CSS Modules e CSS in JS
* CSS Modules: usa-se uma ferramenta para que os estilos sejam escopados por padrão. O que a ferramenta faz é carregar os seletores dos componentes e dos arquivos de CSS e criar seletores novos e únicos para inserir novamente no markup e nos estilos.
  * https://blog.taller.net.br/introducao-ao-css-modules/
* CSS in JS: existem algumas ferramentas que possibilitam a estilização de aplicações escritas em Javascript usando os recursos da linguagem. O styled-components é um ótimo exemplo disso, e é feito para ser usado com React. O que ele faz é criar componentes que já carregam seu próprio estilo.
  * https://medium.freecodecamp.org/a-5-minute-intro-to-styled-components-41f40eb7cd55
* Para estilos que devem ser compartilhado entre componentes é importante criar um pacote separado e agnóstico ao projeto, para que possa ser usado como módulo em outros projetos e os componentes não quebrem ou fiquem sem estilos quando portados.

## Exemplo simples do CSS de um componente que usa CSS Modules
```
.spaced {
  padding: 1rem;
}

.list {
  /* "Compose" is a CSS Modules resource that combines the classes, providing an extend-like behavior. */
  composes: spaced;
  list-style: none;
}

.item {
  composes: spaced;
  display: none;
}

.title, .text {
  /* This one composes styles from a lib. */
  composes: text from 'natura-styleguide/typography',
}

.open {
  display: block;
}

```
