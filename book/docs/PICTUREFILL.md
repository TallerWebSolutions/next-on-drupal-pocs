# Introdução ao _Responsive Images_

O elemento `HTML <picture>` é um _container_ usado para especificar múltiplos elementos `<source>` para um elemento específico `<img>` contido nele. O navegador irá escolher a imagem mais adequada de acordo com o layout atual da página. Existe o atributo `srcset` que é feito a especificação das `URLs` para ser usada em diferentes situações.

![Responsive Images - PictureFill](assets/picturefill.png)

# Exemplo usando elemento html `<picture>`

```html
<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
  <source media="(min-width: 800px)" srcset="elva-800w.jpg">
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
</picture>
```

# Exemplo usando os atributos `srcset` e `sizes` do elemento html `<img>`

```html
<img src="clock-demo-thumb-200.png"
      alt="Clock"
      srcset="clock-demo-thumb-200.png 200w,
          clock-demo-thumb-400.png 400w"
      sizes="(max-width: 600px) 200px, 50vw">
```

> Tanto a `<picture>` quanto o `srcset` não são 100% compatíveis com todos os navegadores, mas ambos atendem de maneira satisfatória. Se um navegador não entender o elemento `<picture>`, ele usará o elemento `<img>` dentro dele. Se um navegador não entender `<img srcset ...>` voltará a usar o atributo `src` da imagem. Os elementos `<picture>` (e os sub-elementos de `<source>`) são os diferenciais quando você quer fazer a direção da arte em diferentes tamanhos / proporções de aspecto da imagem. O atributo srcset do elemento `<img>` é muito mais leve e é tudo o que você precisa se quiser projetar para diferentes displays de resolução.

# [_POLYFILL PictureFill_](http://scottjehl.github.io/picturefill/)

Permite suporte para o elemento html `<picture>` e recursos associados em navegadores que ainda não os suportam, para que você possa começar a usá-los.
