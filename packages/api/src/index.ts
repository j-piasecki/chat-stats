import express from 'express'
import cors from 'cors'
import http from 'http'
import https from 'https'
import fs from 'fs'

import { getEmotesMostOftenUsedAlongInChannel } from './getEmotesMostOftenUsedAlongInChannel.js'
import { getFirstTimerCountInChannel } from './getFirstTimerCountInChannel.js'
import { getMessageCountInChannel } from './getMessageCountInChannel.js'
import { getMessagesInChannel } from './getMessagesInChannel.js'
import { getMessagesInChannelForUsers } from './getMessagesInChannelForUsers.js'
import { getMostUsedEmotesInChannel } from './getMostUsedEmotesInChannel.js'
import { getSubscriberCountInChannel } from './getSubscriberCountInChannel.js'
import { getTotalEmoteCountInChannel } from './getTotalEmoteCountInChannel.js'
import { getUserCountInChannel } from './getUserCountInChannel.js'
import { getUserMessagesCountPerChannel } from './getUserMessagesCountPerChannel.js'
import { extractTimestamps } from './utils.js'

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
app.use(extractTimestamps)

app.get('/mostUsedEmoteAlong/:channel/emote/:emote', getEmotesMostOftenUsedAlongInChannel)
app.get('/firstTimers/:channel', getFirstTimerCountInChannel)
app.get('/messageCount/:channel', getMessageCountInChannel)
app.get('/channel/:channel', getMessagesInChannel)
app.get('/channel/:channel/users/:user/*', getMessagesInChannelForUsers)
app.get('/mostUsedEmotes/:channel', getMostUsedEmotesInChannel)
app.get('/subscriberCount/:channel', getSubscriberCountInChannel)
app.get('/emoteCount/:channel', getTotalEmoteCountInChannel)
app.get('/userCount/:channel', getUserCountInChannel)
app.get('/messageCountPerChannel/:user', getUserMessagesCountPerChannel)

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
