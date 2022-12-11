import express from 'express'
import cors from 'cors'
import http from 'http'
import https from 'https'
import fs from 'fs'

import { getMessagesInChannel } from './getMessagesInChannel.js'

export interface APIConfig {
  http?: {
    port: number
  }
  https?: {
    port: number
    key: string
    cert: string
  }
}

const config: APIConfig = JSON.parse(fs.readFileSync('config.json', 'utf-8'))

const app = express()
app.use(cors())

app.get('/channel/:channel', getMessagesInChannel)

if (config.http) {
  const httpServer = http.createServer(app)
  httpServer.listen(config.http.port)
}

if (config.https) {
  const key = fs.readFileSync(config.https.key, 'utf-8')
  const crt = fs.readFileSync(config.https.cert, 'utf-8')
  const credentials = { key: key, cert: crt }
  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(config.https.port)
}
