import ipc from 'node-ipc'

import { Database } from 'chat-stats-database'
import { Eavesdropper } from './Eavesdropper.js'

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
  Database.saveMessage(
    message,
    user['room-id']!,
    channel,
    user['user-id']!,
    user.username!,
    user.subscriber ?? false,
    user.mod ?? false,
    user.turbo ?? false,
    user['first-msg'] ?? false
  )

  ipc.server.broadcast('message', {
    channel: channel,
    user: user,
    message: message,
  })
})

eavesdropper.connect()
