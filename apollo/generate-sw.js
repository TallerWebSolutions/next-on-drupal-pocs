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
				'/setup',
				'/static/47881-0.jpg',
				'/static/49057-0_0.jpg',
				'/static/77144-0.jpg',
				'/static/80417-0.jpg',
				'/static/81017-0.jpg',
				'/static/82290-0.jpg',
				'/static/84734-0.jpg',
				'/static/setup.png'
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
