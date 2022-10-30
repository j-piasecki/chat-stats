import ipc from 'node-ipc'
import { Database } from 'chat-stats-database'

import { EmoteExtractor } from './EmoteExtractor.js'

const extractor = new EmoteExtractor()

ipc.config.silent = true
ipc.connectTo('eavesdropper', 'eavesdropper.service', () => {
  console.log('Connected to the Eavesdropper')

  ipc.of.eavesdropper.on('message', (data) => {
    extractor.extractEmotes(data.message, data.user).then((emotes) => {
      Database.updateEmoteUsage(
        emotes,
        data.user['room-id'],
        data.channel,
        data.user['user-id'],
        data.user.username
      )
    })
  })
})
