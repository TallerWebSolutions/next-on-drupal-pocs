# Estrutura de pastas da App

* src
  * pages (páginas do Next)
  * modules (módulos de funcionalidades da app)
    * moduleName
      * components (Componentes React)
      * containers (HOC que acoplam dados e lógica nos componentes)
      * form (components e containers relativos a formulários)
      * lib (lógicas específicas do módulo)
    * lib (lógicas reaproveitáveis por toda a app)
    * components (que são usados na app inteira, como o Page ou MainHeader, por exemplo)
    * containers (que servem de providers para a app toda ou para páginas)
  * tests (testes automatizados)
    * unit (testes unitários e de snapshot do Jest)
    * e2e (testes funcionais e de regressão visual, normalmente utilizando Nightwatch)
* static (somente no Next, aqui ficam os arquivos estáticos)
