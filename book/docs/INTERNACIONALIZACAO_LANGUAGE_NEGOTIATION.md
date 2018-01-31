# Negociação do idioma

A negociação de idioma é feita utilizando o plugin de detecção de idioma do i18next chamado "i18next-browser-languageDetector".

Com este plugin temos acesso tanto a detecção de idioma automática pelo navegador do usuário utilizado no código:

```javascript
// Initialize server/client based language-detection solutions.
if (process.browser) {
  i18next.use(require('i18next-browser-languagedetector'))
}
```

Este plugin também nos fornece a alteração do idioma através da query string `lng` na url, ex: `?lng=pt-br`

### Links úteis:

[i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)
