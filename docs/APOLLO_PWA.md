# Configurações do manifesto

O manifesto do app da Web é um arquivo `JSON` simples que proporciona a capacidade de controlar a aparência do seu aplicativo para o usuário nas áreas onde ele pode ver aplicativos (por exemplo, na tela inicial do celular), direcionar o que o usuário pode acessar e o mais importante como pode acessar.

Usando o manifesto do app da Web, seu aplicativo pode:
 - Ter uma presença avançada na tela inicial do Android do usuário
 - Ser iniciado no modo de tela inteira no Android sem uma barra de URL
 - Controlar a orientação da tela para proporcionar uma visualização ideal
 - Definir uma experiência de inicialização com "tela de apresentação" e uma cor de tem para o site
 - Acompanhar se o aplicativo foi iniciado da tela inicial ou da barra de URL


Na raíz do projeto vamos criar o arquivo `manifest.json`

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

# Criando o `service-worker`

Criamos um arquivo `generate-sw.js` na raíz do projeto para gerar o `service-worker` da nossa aplicação:

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
let staticCacheName = 'pwa-poc-v1'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        '/products',
        '/about',
       'https://api.graph.cool/simple/v1/cjatzjtkl26rv0105sypiowg2'
      ])
      .then(() => self.skipWaiting())
    })
  )
})

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }

        var fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(response => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            var responseToCache = response.clone()

            caches.open(staticCacheName)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        )
      })
    )
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

> generate-sw - Irá gerar o service-worker.js dentro do build do nextjs no diretório `.next/`

> Event fetch - O que estamos fazendo é:
 - Adicionar um retorno de chamada a .then() na solicitação fetch.
 - Após obter uma resposta, executar as seguintes verificações:
   - Verificar se a resposta é válida.
   - Verificar se o status da resposta é 200
   - Verificar se o tipo de resposta é basic, o que indica que é uma solicitação de nossa origem. Isso significa que solicitações de ativos de terceiros não são armazenadas no cache.
 - Se todas as verificações forem bem-sucedidas, clonaremos a resposta. O motivo para isso é que, como a resposta é um Stream, o corpo poderá ser consumido apenas uma vez. Como queremos retornar a resposta para uso pelo navegador, bem como passá-la para uso pelo cache, precisamos cloná-la para podermos enviá-la ao navegador e ao cache.

Alteramos o `scripts` do `package.json` ficando assim:

```json
"scripts": {
  "dev": "NODE_ENV=development node server",
  "build": "next build && node generate-sw.js",
  "start": "NODE_ENV=production node server"
}
```

# Preparando a aplicação para instalar o `service-worker`

A primeira etapa necessária para fazer com que o aplicativo funcione off-line é registrar um service worker, um script que oferece a funcionalidade off-line sem precisar de uma página da Web aberta ou de interação do usuário.

Adicionado o diretório `utils` na raíz do projeto e o arquivo `utils/offline-install.js`:

```javascript
if (
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator
) {
  navigator.serviceWorker
    .register('/service-worker.js', {
      scope: './'
    })
    .then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available.')
              } else {
                console.log('Content is now available offline!')
              }
              break
            case 'redundant':
              console.log('The installing serviceWorker became redundant.')
              break
          }
        }
      }
    })
    .catch(e => {
      console.error('Error during service worker registration:', e)
    })
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
