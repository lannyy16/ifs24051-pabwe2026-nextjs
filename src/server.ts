import next from 'next'
import { createServer } from 'node:http'
import { parse } from 'node:url'
import { APP_PORT } from './lib/config'

const dev = process.argv.includes('--dev')
const hostname = '0.0.0.0'
const port = APP_PORT
const app = next({ dev, hostname, port, turbopack: dev })
const handle = app.getRequestHandler()
await app.prepare()
createServer((req,res) => handle(req,res,parse(req.url || '',true))).listen(port,hostname,()=>console.log(`> Next.js running at http://localhost:${port}`))
