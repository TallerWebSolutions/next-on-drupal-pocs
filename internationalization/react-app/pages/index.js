/* eslint-disable react/prop-types */
import React from 'react'
import { compose } from 'recompose'
import i18next from 'i18next'
import { I18nextProvider, translate } from 'react-i18next'

import gql from 'graphql-tag'
import initApollo from '../src/lib/initApollo'

const apollo = initApollo({})

const i18nOptions = {
  // fallbackLng: 'en',
  debug: false,
  whitelist: ['en', 'pt-BR'], // @TODO: list languages from Drupal?
  ns: [], // do not fetch any namespace unless required.
  load: 'currentOnly', // avoid 'en' when 'en-US' due to need of fetching.
}

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
     * @TODO: is there any way a i18n plugin can be both 3rdParty and Backend?
     */
    i18n.services.backendConnector.backend = {
      type: 'backend',

      /**
      * Callback for reading a language on a namespace.
      */
      read: (language, context, callback) => {
        const options = {
          query: this.queries.translations,
          variables: { language, context }
        }

        console.log('reading')

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
    i18n.on('*', (e, ...args) => {
      console.log('EVENt', e, args)
      // instance.options.parseMissingKeyHandler = () => {
      //     return options.missingKeyValue;
      // };
      //
      // const languages = typeof lngs === 'string' ? [ lngs ] : lngs;
      // languages.map(l => requestKey(key, l, ns));
    })
  }
}

/**
 * Provider HoC.
 */
const withI18n = ComposedComponent => class WithI18n extends React.Component {
  constructor (props) {
    super(props)

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

const HelloWorld = ({ t = v => v }) => (
  <div>
    AQUI: { t('string teste ') }
  </div>
)

const TranslatedHelloWorld = translate('a')(HelloWorld)

const Home = () => (
  <div>
    <TranslatedHelloWorld />
  </div>
)

export default compose(
  withI18n
)(Home)
