# Configurações do manifesto

O manifesto do _Web App_ é um arquivo `JSON` que permite controlar a aparência do seu aplicativo para o usuário nas áreas onde são apresentados os ícones de aplicativos, direcionar o que o usuário pode acessar e, mais importante, como pode acessar.

Usando o manifesto do _Web App_, o aplicativo pode:
 - Ter um ícone personalizado na tela inicial do dispositivo do usuário
 - Ser iniciado no modo de tela cheia, sem uma barra de URL
 - Controlar a orientação da tela para proporcionar uma visualização ideal
 - Definir uma experiência de inicialização com "tela de apresentação" e uma cor de tema para o site
 - Acompanhar se o aplicativo foi iniciado da tela inicial ou da barra de URL


Na raíz do projeto, vamos criar o arquivo `manifest.json`.

```json
{
  "name": "Natura POC",
  "short_name": "NCF POC",
  "icons": [{
    "src": "images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
  }],
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#3E4EB8",
  "theme_color": "#2F3BA2"
}
```

# Criando o _Service Worker_

## Pré-requisitos
 - Compatibilidade de navegadores: O número de opções de navegadores está crescendo. _Service Workers_ são compatíveis com Firefox, Opera e Chrome.
 - HTTPS: Durante o desenvolvimento, você poderá utilizar _Service Workers_ localmente (`localhost`) sem necessidade de certificado SSL. No entanto, para implantá-lo em produção, será necessário ter o SSL configurado.

Criar o arquivo `generate-sw.js`, na raíz do projeto, para gerar o _service worker_ da nossa aplicação:

```javascript
const fs = require('fs')
const path = require('path')
const loadJsonFile = require('load-json-file');

const dotNext = path.resolve(__dirname, './.next')
const target = path.resolve(__dirname, './.next/service-worker.js')

function bundles(app) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${dotNext}/bundles/pages`, (err, files) => {
      if (err) {
        resolve(app)
      }

      if (files) {
        const root = `/_next/${app.buildId}/page`
        app.precaches = app.precaches.concat(files
          .filter(file => file !== 'index.js')
          .map(file => {
            // req /_next/22321e97-8895-48db-b915-82e255f3faa8/new
            return path.join(root, file.replace(/.js$/, ''))
          })
        )
      }

      resolve(app)
    })
  })
}

function chunks(app) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${dotNext}/chunks`, (err, files) => {
      if (err) {
        resolve(app)
      }

      if (files) {
        const root = `/_next/webpack/chunks`
        app.precaches = app.precaches.concat(files
          .filter(file => /\.js$/.test(file))
          .map(file => {
            // req /_next/webpack/chunks/22321e97-8895-48db-b915-82e255f3faa8.js
            return path.join(root, file)
          })
        )
      }

      resolve(app)
    })
  })
}

function app() {
  const app = {
    buildId: fs.readFileSync(`${dotNext}/BUILD_ID`, 'utf8'),
    precaches: []
  }

  return loadJsonFile(`${dotNext}/build-stats.json`).then(stats => {
    Object.keys(stats).map(src => {
      // /_next/9265fa769281943ee96625770433e573/app.js
      app.precaches.push(`/_next/${stats[src].hash}/${src}`)
    })

    return app
  })
}

const swSnippet = (precache) =>
`
var staticCacheName = 'pwa'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        '/products',
        '/about',
        '/static/47881-0.jpg',
        '/static/49057-0_0.jpg',
        '/static/77144-0.jpg',
        '/static/80417-0.jpg',
        '/static/81017-0.jpg',
        '/static/82290-0.jpg',
        '/static/84734-0.jpg'
      ])
      .then(() => self.skipWaiting())
    })
  )
})

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(staticCacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
})
`

app()
  .then(chunks)
  .then(bundles)
  .then(app => {
    fs.writeFileSync(target,
      swSnippet(JSON.stringify(app.precaches, null, 2)),
      'utf8'
    )
  })
```

> generate-sw - Irá gerar o service-worker.js dentro do build do nextjs, no diretório `.next/`

> Event fetch - O que estamos fazendo é:
 - Adicionar um retorno de chamada a .then() na solicitação fetch.
 - Após obter uma resposta, executar as seguintes verificações:
   - Verificar se a resposta é válida.
   - Verificar se o status da resposta é 200
   - Verificar se o tipo de resposta é basic, o que indica que é uma solicitação de nossa origem. Isso significa que solicitações de ativos de terceiros não são armazenadas no cache.
 - Se todas as verificações forem bem-sucedidas, clonaremos a resposta. O motivo para isso é que, como a resposta é um _Stream_, o corpo (body) poderá ser consumido apenas uma vez. Como queremos retornar a resposta para uso pelo navegador, bem como passá-la para uso pelo cache, precisamos cloná-la para podermos enviá-la ao navegador e ao cache.

> ATENÇÃO - Ao trabalhar com query no next/router o service-worker da um error e automaticamente ja faz um unregister. Pois o nextjs gera uma url como por exemplo: http://localhost:3000/products?param=data

Alteramos o atributo `scripts` do `package.json` ficando assim:

```json
"scripts": {
  "dev": "NODE_ENV=development node server",
  "build": "next build && node generate-sw.js",
  "start": "NODE_ENV=production node server"
}
```

# Preparando a aplicação para instalar o `service-worker`

A primeira etapa necessária para fazer com que o aplicativo funcione _off-line_ é registrar um _service worker_, um script que oferece a funcionalidade _off-line_ sem precisar de uma página da Web aberta ou de interação do usuário.

Adicionado o diretório `utils` na raíz do projeto e o arquivo `utils/offline-install.js`:

```javascript
if(typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: './', insecure: true}).then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful!', registration);
  }).catch(function(err) {
    // registration failed :(
    alert('ServiceWorker registration failed: ', err);
  });
}
```

Em seguida alteramos o `pages/index.js` para importar o `offline-install.js`

```javascript
import '../utils/offline-install'

import App from '../components/App'
import Header from '../components/Header'
import PageList from '../components/PageList'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <PageList />
  </App>
))
```

# Modelos de celulares que foram testados:

```bash
j7 prime
lg k10
lenovo p2
j1 2016
motox force
asus zenfone
moto x 2
s3
lenovo k10a40
```
