# Negociação do idioma

Autilização da negociação de idioma é feita utilizando o plugin de detecção de idioma do i18next chamado "i18next-browser-languageDetector".

Com este plugin temos acesso tanto a detecção de idioma automática pelo navegador do usuário utilizado no código:

```javascript
// Initialize server/client based language-detection solutions.
if (process.browser) {
  i18next.use(require('i18next-browser-languagedetector'))
}
```

Além disso nos fornece a alteração do idioma através da utilização de query strings na url com o padrão `?lng=LANGUAGE`

Links úteis:
[i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)
