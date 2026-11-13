import { randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import express from 'express'
import session from 'express-session'
import apiRoutes from './routes/apiRoutes.js'

const app = express()
const server = createServer(app)
const port = Number(process.env.PORT || 5173)
const production = process.argv.includes('--production')

app.use(express.json())
app.use(session({
  secret: randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
}))
app.use('/api', apiRoutes)
app.use('/api', (req, res) => res.status(404).json({ error: 'Маршрут не найден.' }))

app.get('/admin', (req, res) => res.redirect('/gallery'))
app.get('/admin/news', (req, res) => res.redirect('/news'))

if (production) {
  app.use(express.static(resolve('dist')))
  app.get('/{*path}', (req, res, next) => {
    if (!req.accepts('html') || /\.[^/]+$/.test(req.path)) return next()
    res.sendFile(resolve('dist/index.html'))
  })
} else {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true, ws: { server } },
  })

  app.use(vite.middlewares)
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Пиксельная студия — http://127.0.0.1:${port}`)
})
