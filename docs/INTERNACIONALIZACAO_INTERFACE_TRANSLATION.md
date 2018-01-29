# Internacionalização de interface

Para a internacionalização da interface (Nextjs) estamos utilizando o módulo react-i18next para controlar as traduções do lado do front-end e i18next para se comunicar com o GraphQL que irá fornecer as consultas de traduções do Drupal.

## i18next

O i18next basicamente é um framework de internacionalização, mas vai mais além, fornecendo uma solução completa de localização.

Dentre as funcionalidades do i18next incluem:
 - Detecção do idioma do usuário;
 - Carregamento dos idiomas;
 - Cache dos idiomas (opcional).

## Fields no Drupal GraphQL

Para podermos consumir as traduções do Drupal, utilizamos o módulo GraphQL que serve como um meio de campo entre o Drupal e o NextJS.

Foram criados dois fields principais para nos auxiliar no serviço de tradução.

### RootTranslations Field

Basicamente neste Field utilizamos a classe StringInterface do Drupal para nos retornar através de uma query o conjunto de traduções baseados nos argumentos: idioma, string chave de tradução (source) e contexto.

```php
/**
 *
 * @GraphQLField(
 *   id = "translations",
 *   secure = true,
 *   name = "translations",
 *   type = "Translation",
 *   multi = true,
 *   arguments = {
 *     "language" = {
 *       "type" = "String",
 *       "nullable" = true
 *     },
 *     "context" = {
 *       "type" = "String",
 *       "nullable" = true
 *     },
 *     "translated" = {
 *       "type" = "Boolean",
 *       "nullable" = true,
 *       "default" = true
 *     }
 *   }
 * )
 */
 public function resolveValues($id, array $args, ResolveInfo $info) {
   $stringInterfaces = $this->stringDatabaseStorage->getTranslations($args, []);

   foreach ($stringInterfaces as $stringInterface) {
     yield $stringInterface->getValues(['language', 'source', 'translation', 'context']);
   }
 }
```

Este field é muito importante pois graças a ele conseguimos o conjunto completo de uma tradução por um contexto e idioma, como por exemplo um contexto "home", em apenas uma requisição conseguimos todas traduções que precisamos para página home.

### RootTranslation Field

Este field utiliza a classe LocaleTranslation do Drupal e é responsável por nos retornar uma tradução indivídual, ou seja podemos consultar uma tradução de apenas uma chave no drupal, utilizando a string a ser traduzida, o idioma e o contexto desta string. Além disso caso a string não seja encontrada, a função considera que é uma nova chave de interface para o contexto e idioma passado, assim é criado uma nova entrada de interface para tradução no Drupal.

```php
/**
 *
 * @GraphQLField(
 *   id = "translation",
 *   secure = true,
 *   name = "translation",
 *   type = "String",
 *   arguments = {
 *     "langcode" = {
 *       "type" = "String",
 *       "nullable" = true,
 *       "default" = ""
 *     },
 *     "string" = {
 *       "type" = "String"
 *     },
 *     "context" = {
 *       "type" = "String",
 *       "nullable" = true,
 *       "default" = ""
 *     }
 *   }
 * )
 */
 public function resolveValues($root, array $args, ResolveInfo $info) {
   yield call_user_func_array([$this->localeTranslation, 'getStringTranslation'], $args) ?: NULL;
 }
```

## react-i18next e i18next na aplicação

Para controle da tradução de interface no NextJS utilizamos o conjunto de pacotes do i18next, nesta poc foi implementado da seguinte forma:

Parâmetros de inicialização do i18next:

```javascript
const i18nOptions = {
  fallbackLng: 'en',
  debug: false,
  whitelist: ['en', 'pt-BR'], // @TODO: list languages from Drupal?
  ns: [], // do not fetch any namespace unless required.
  load: 'currentOnly', // avoid 'en' when 'en-US' due to need of fetching.
  nsSeparator: '||',

  saveMissing: true, // enables whole missing key handling.
  saveMissingTo: 'current', // what language to save a missing key into.
}
```

Para integração do i18next com o GraphQL do Drupal houve a necessidade de implementarmos um plugin no padrão do i18next.

Este plugin é responsável por toda lógica de comunicação entre o NextJS e o GraphQL, bem como as queries para os fields que implementamos no Drupal e as funções do padrão i18next. Para essa comunicação utilizamos um client do Apollo.

```javascript
class DrupalGraphQLI18nextPlugin {
  type = '3rdParty'

  queries = {
    /**
     * Performs a single key translation fetch.
     */
    translation: gql`
      query Translation($langcode: String!, $string: String!, $context: String! = "") {
        translation(langcode: $langcode, string: $string, context: $context)
      }
    `,

    /**
     * Performs a context (namespace) fetch.
     */
    translations: gql`
      query Translations($language: String!, $context: String! = "") {
        translations(language: $language, context: $context) {
          context
          translation
          language
          source
        }
      }
    `
  }

  constructor (client) {
    this.client = client
  }

  init (i18n) {
    /**
     * Set backend plugin.
     */
    i18n.services.backendConnector.backend = {
      type: 'backend',

      /**
      * Callback for reading a language on a namespace.
      */
      read: (language, context, callback) => {
        context = context === 'translation' ? '' : context

        const options = {
          query: this.queries.translations,
          variables: { language, context }
        }

        const query = this.client.query(options)

        // Assign error handling.
        query.catch(callback)

        // Add result to store.
        query.then(response => {
          callback(null, response.data.translations.reduce((result, { source, translation }) => ({
            ...result,
            [source]: translation
          }), {}))
        })
      }
    }

    /**
     * Listen for missing keys to fetch isolated strings.
     */
    i18n.on('missingKey', (language, namespace, key) => {
      // when language is not defined, it should use default key.
      if (!language) return

      const context = namespace === 'translation' ? '' : namespace

      const options = {
        query: this.queries.translation,
        variables: {
          langcode: language,
          string: key,
          context,
        }
      }

      // being currently requested.
      const query = this.client.query(options)

      // Assign error handling.

      // Add result to store.
      query.then(response => {
        if (response.data.translation) {
          i18n.addResources(language, namespace, {
            [key]: response.data.translation
          })
        }
      })
    })
  }
}
```

Implementação do HighOrderComponent para inicialização do i18next utilizando as opções definidas, o plugin backend implementado e client do Apollo. Além disso neste HoC utilizamos o pacote "i18next-browser-languagedetector" para detectar o idioma que o usuário está utilizando.


```javascript
/**
 * Provider HoC.
 */
const withI18n = ComposedComponent => class WithI18n extends React.Component {
  constructor (props) {
    super(props)

    const apollo = initApollo({})

    // Initialize server/client based language-detection solutions.
    if (process.browser) {
      i18next.use(require('i18next-browser-languagedetector'))
    }

    this.i18n = i18next
      .use(new DrupalGraphQLI18nextPlugin(apollo))
      .init(i18nOptions)
  }

  render () {
    return (
      <I18nextProvider i18n={ this.i18n }>
        <ComposedComponent { ...this.props } />
      </I18nextProvider>
    )
  }
}
```

Para a utilização do i18next criamos um componente e utilizamos o HoC translate do i18next através deste HoC temos acesso a função "t" que é efetivamente a função de tradução do i18next. Segue o exemplo de utilização da função de tradução.

```javascript
const HelloWorld = ({ t = v => v }) => {
  const count1 = 1
  const count5 = 5

  return (
    <div>
      <h1>POC - { t('Internationalization') }</h1>
      <p>{ t('Welcome to the poc of internationalization, here we show some stuffs of this incredible feature. This is a interface translated using the i18next framework.') }</p>
      <p>{ t('Plurals') }</p>
      <p>{ count1 > 1 ? count1 + ' ' + t('oranges') : t('1 orange') }</p>
      <p>{ count5 > 1 ? count5 + ' ' + t('oranges') : t('1 orange') }</p>
    </div>
  )
}

const TranslatedHelloWorld = translate('contextHelloWorld')(HelloWorld)

const Home = () => (
  <div>
    <TranslatedHelloWorld />
  </div>
)

export default compose(
  withI18n
)(Home)
```
