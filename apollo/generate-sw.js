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
var staticCacheName = 'pwa-poc-v1'

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
        // Cache hit - return response
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
