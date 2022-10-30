import ipc from 'node-ipc'

import { Database } from 'chat-stats-database'
import { Eavesdropper } from './Eavesdropper.js'
import { GameRegistry } from './GameRegistry.js'

const gameRegistry = new GameRegistry()
await Database.tryInit()

ipc.config.id = 'eavesdropper'
ipc.config.silent = true

ipc.serve('eavesdropper.service', () => {
  ipc.server.on('connect', () => {
    console.log('Client connected')
  })
})

ipc.server.start()

const eavesdropper = new Eavesdropper((channel, user, message) => {
  const timestamp = Date.now()

  gameRegistry.getChannelGame(user['room-id']!).then((game) => {
    Database.saveMessage(
      message,
      timestamp,
      user['room-id']!,
      channel,
      user['user-id']!,
      user.username!,
      game.id,
      game.name,
      game.thumbnailUrl,
      user.subscriber ?? false,
      user.mod ?? false,
      user.turbo ?? false,
      user['first-msg'] ?? false
    )
  })

  ipc.server.broadcast('message', {
    channel: channel,
    user: user,
    message: message,
    timestamp: timestamp,
  })
})

eavesdropper.connect()
