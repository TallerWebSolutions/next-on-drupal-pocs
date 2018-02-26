# Estrutura de pastas da App

* src/
  * pages/ (páginas do Next)
  * components/ (componentes React gerais da APP. i.e. "Page")
    * [NOME DO COMPONENTE]
      * [NOME DO COMPONENTE].js
      * [NOME DO COMPONENTE].css
      * __tests__/
  * containers/ (componentes ou HoC inteligentes)
    * [NOME DO CONTAINER]
      * [NOME DO CONTAINER].js
      * query.js
      * mutation.js
      * __tests__/
  * lib (funções e serviços gerais da APP)
    * __tests__/
  * modules (módulos separados por domínio)
    * [NOME DO MODULO]
      * components (componentes específicos do módulo)
      * containers (containeres específicos do módulo)
      * form (components e containers relativos a formulários)
      * lib (funções e serviços específicos do módulo)
* tests (testes automatizados)
  * e2e (testes funcionais e de regressão visual, normalmente utilizando Nightwatch)
* static (somente no Next, aqui ficam os arquivos estáticos)

## Legenda
* **Module**: código relativo a um mesmo domínio de negócio;
* **Component**: componentes React puramente presentacionais;
* **Container**: componentes React conscientes do estado ou da API;
