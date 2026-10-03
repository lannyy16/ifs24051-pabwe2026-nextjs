import next from 'next'
import { createServer } from 'http'
import { APP_PORT } from './lib/config'
const dev=process.env.NODE_ENV!=='production'
const app=next({dev})
const handle=app.getRequestHandler()
app.prepare().then(()=>createServer((req,res)=>handle(req,res)).listen(APP_PORT,()=>console.log(`> Next.js ready: http://localhost:${APP_PORT}`)))
