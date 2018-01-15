const fs = require('fs')
const path = require('path')
const loadJsonFile = require('load-json-file');

const dotNext = path.resolve(__dirname, './.next')
const target = path.resolve(__dirname, './.next/service-worker.js')

function mains(app) {
	return new Promise((resolve, reject) => {
		app.precaches = app.precaches.concat([
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

		resolve(app)
	})
}

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
importScripts('/static/cache-polyfill.js')

var staticCacheName = 'pwa'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(${precache})
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
        return fetch(event.request);
      }
    )
  );
})
`

app()
  .then(mains)
	.then(chunks)
	.then(bundles)
	.then(app => {
		fs.writeFileSync(target,
			swSnippet(JSON.stringify(app.precaches, null, 2)),
			'utf8'
		)
	})
