# Internacionalização de conteúdo e termos de interface

A internacionalização (i18n) de páginas tem como objetivo o controle e exibição do conteúdo e interface adaptáveis a diversas linguagens e culturas de acordo com dados e preferências do browser e do usuário.

![Markdown Course](assets/i18n.png)

# Tecnologias

As tecnologias escolhidas para esta prova de conceito foram:

- Módulos locale, translation do Drupal core
- Módulos contribuidos graphql, paragraphs
- Next.js
- React
- Apollo Client 2
- i18next

# Análise

Durante o processo de análise foram levantados os seguintes critérios:

- Testar internacionalização de paragraphs, revisions e entity references (taxonomias, etc)
- Testar fluxo de tradução de conteúdo
- Módulo GraphQL do Drupal: passando parâmetros para campo `route` e outros como de listagens (views) para que o conteúdo seja filtrado por um determinado idioma
- Internacionalização de interface React/Next integrado com strings do Drupal
- Negociação de idioma baseado em dados do browser, detectar automáticamente no idioma do browser e persistir
- Algum `language switcher` para poder mudar o idioma da app

# Abordagens

## Tradução de conteúdos

Para a tradução de conteúdos, foi utilizado o combo tradicional do Drupal 8 core para esta função. Com a adição do módulo _paragraphs_, que por sinal se integra bem com o sistema de internacionalização e também com o revisionamento de conteúdo.

## Tradução da APP/PWA

Aproveitamos o conceito de contextos do sistema de tradução do Drupal para agrupar traduções que podem relacionadas com a PWA como um todo ou uma parte específica da aplicação. Desta forma conseguimos carregar um set de tradução em uma única requisição para uma determinada página ou seção da aplicação.
