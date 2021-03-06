const express = require('express')
const path = require('path')
const next = require('next')
let cors = require('cors')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(_ => {
    const server = express()

    server.use(cors())

    server.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`)
      }else{
        next()
      }
    })

    // serve service worker
    server.get('/service-worker.js', (req, res) => res.sendFile(path.resolve('./.next/service-worker.js')))

    server.get('*', (req, res) => handle(req, res))

    server.listen(3000, err => {
      if (err) throw error;

      console.log('> App running on port 3000')
    })
})
